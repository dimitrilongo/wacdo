#!/bin/bash

# Chemins
FRONTEND_DIR="/var/www/vhosts/eager-mestorf.141-94-242-165.plesk.page/httpdocs/frontend"
PUBLIC_DIR="/var/www/vhosts/eager-mestorf.141-94-242-165.plesk.page/httpdocs/backend/public"

echo "➡ Déplacement dans le dossier frontend"
cd "$FRONTEND_DIR" || exit 1

echo "➡ Nettoyage cache npm/vite"
rm -rf dist node_modules/.vite

echo "📦 npm install"
/opt/plesk/node/20/bin/npm install

echo "🛠 npm run build"
/opt/plesk/node/20/bin/npm run build

echo "🧹 Nettoyage ancien build dans public/"
rm -rf "$PUBLIC_DIR/assets"
rm -f "$PUBLIC_DIR/index.html" "$PUBLIC_DIR/vite.svg" "$PUBLIC_DIR/manifest.json"

echo "📁 Copie des fichiers build dans public/"
cp -R dist/* "$PUBLIC_DIR/"

echo "🧾 Copie d’un nouveau .htaccess pour React (si besoin)"
cat > "$PUBLIC_DIR/.htaccess" <<'EOF'
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Laisser passer les vrais fichiers
    RewriteCond %{REQUEST_FILENAME} -f [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]

    # Rediriger tout le reste vers index.html (React SPA)
    RewriteRule ^ index.html [L]
</IfModule>

<IfModule mod_headers.c>
    Header set Cache-Control "no-store, no-cache, must-revalidate, max-age=0"
    Header set Pragma "no-cache"
    Header set Expires 0
</IfModule>
EOF

echo "✅ Déploiement terminé : $(date)" > "$PUBLIC_DIR/build.log"
echo "✅ Build terminé avec succès !"
