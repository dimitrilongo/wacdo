<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Supprimer la colonne 'name' existante
            $table->dropColumn('name');

            // Ajouter les nouvelles colonnes selon vos spécifications
            $table->string('nom');
            $table->string('prenom');
            $table->dateTime('date_embauche');
            $table->boolean('is_admin')->default(false);

            // Renommer la colonne password en mot_de_passe
            $table->renameColumn('password', 'mot_de_passe');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Restaurer la colonne 'name'
            $table->string('name');

            // Supprimer les nouvelles colonnes
            $table->dropColumn(['nom', 'prenom', 'date_embauche', 'is_admin']);

            // Renommer mot_de_passe en password
            $table->renameColumn('mot_de_passe', 'password');
        });
    }
};
