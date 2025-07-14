#!/bin/bash

# Script para configurar AWS Secrets e resolver erro "Failed to set up process.env.secrets"
# Criado para projeto TMDB API Explorer

echo "🚀 Configurando AWS Secrets para Amplify..."
echo "📝 Projeto: TMDB API Explorer"
echo ""

# Verificar se AWS CLI está configurado
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI não está configurado. Execute: aws configure"
    exit 1
fi

# Ler token do arquivo .env.local
if [ -f ".env.local" ]; then
    source .env.local
    echo "✅ Token TMDB carregado do .env.local"
else
    echo "❌ Arquivo .env.local não encontrado"
    exit 1
fi

echo ""
echo "🔐 Criando secrets no AWS..."

# 1. Criar secret no AWS Secrets Manager
echo "📁 Criando secret no Secrets Manager..."
aws secretsmanager create-secret \
  --name "amplify/tmdb-api-explorer/producao" \
  --description "Secrets de produção para TMDB API Explorer" \
  --secret-string "{\"NEXT_PUBLIC_TMDB_API_TOKEN\":\"$NEXT_PUBLIC_TMDB_API_TOKEN\"}" \
  --region us-east-1

# 2. Criar parâmetro no SSM Parameter Store
echo "📋 Criando parâmetro no SSM..."
aws ssm put-parameter \
  --name "/amplify/d2jcbfap2y9vl9/aws-deploy-test/NEXT_PUBLIC_TMDB_API_TOKEN" \
  --value "$NEXT_PUBLIC_TMDB_API_TOKEN" \
  --type "SecureString" \
  --description "Token da API TMDB para aplicação Next.js" \
  --region us-east-1 \
  --overwrite

# 3. Criar política IAM
echo "🔑 Criando política IAM..."
POLICY_ARN=$(aws iam create-policy \
  --policy-name "AmplifySecretsAccess-TMDB" \
  --policy-document file://aws-iam-policy.json \
  --description "Acesso aos secrets do Amplify para TMDB API" \
  --query 'Policy.Arn' \
  --output text)

# 4. Criar role de serviço para Amplify se não existir
echo "👤 Verificando service role do Amplify..."
AMPLIFY_ROLE="amplify-tmdb-service-role"

# Criar trust policy para o role
cat > amplify-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "amplify.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Criar o role se não existir
aws iam create-role \
  --role-name $AMPLIFY_ROLE \
  --assume-role-policy-document file://amplify-trust-policy.json \
  --description "Service role para Amplify TMDB API Explorer" 2>/dev/null || echo "✓ Role já existe"

# 5. Anexar políticas necessárias ao role
echo "🔗 Anexando políticas ao role..."
aws iam attach-role-policy --role-name $AMPLIFY_ROLE --policy-arn "arn:aws:iam::aws:policy/AdministratorAccess-Amplify"
aws iam attach-role-policy --role-name $AMPLIFY_ROLE --policy-arn $POLICY_ARN

# 6. Configurar o service role na aplicação Amplify
echo "⚙️ Configurando service role na aplicação..."
ROLE_ARN="arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/$AMPLIFY_ROLE"
aws amplify update-app --app-id d2fg65q13rakq8 --service-role $ROLE_ARN

# Limpar arquivo temporário
rm -f amplify-trust-policy.json

echo ""
echo "✅ Configuração concluída com sucesso!"
echo ""
echo "🎯 O que foi configurado:"
echo "✓ Secret criado: amplify/tmdb-api-explorer/producao"
echo "✓ Parâmetro SSM: /amplify/d2jcbfap2y9vl9/aws-deploy-test/NEXT_PUBLIC_TMDB_API_TOKEN"
echo "✓ Política IAM: AmplifySecretsAccess-TMDB"
echo "✓ Service Role: $AMPLIFY_ROLE"
echo "✓ Role anexado à aplicação Amplify"
echo ""
echo "🚀 Agora faça redeploy da aplicação no Amplify Console!"
echo "O erro 'Failed to set up process.env.secrets' deve estar resolvido."
