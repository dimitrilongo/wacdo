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

echo "🧾 Mise à jour du .htaccess pour Laravel + React"
cat > "$PUBLIC_DIR/.htaccess" <<'EOF'
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Handle X-XSRF-Token Header
    RewriteCond %{HTTP:x-xsrf-token} .
    RewriteRule .* - [E=HTTP_X_XSRF_TOKEN:%{HTTP:X-XSRF-Token}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Laisser passer les fichiers statiques (assets React)
    RewriteCond %{REQUEST_FILENAME} -f
    RewriteRule ^ - [L]

    # Laisser passer les dossiers
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]

    # Rediriger les requêtes /api/* vers Laravel
    RewriteCond %{REQUEST_URI} ^/api/
    RewriteRule ^ index.php [L]

    # Rediriger les autres requêtes vers React (index.html)
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !^/api/
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
