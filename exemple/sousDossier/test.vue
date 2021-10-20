<template>
<div
    class="pp-entete"
    :class="[ classModeAffichage, {
         'pp--has-acces-site-admin': hasAccesSiteAdmin
     }]"
>
    <div class="pp-entete__bandeau">
        <p class="pp-entete__titre-bandeau">
            {{'entete:titre-profil-professionnel' | translate}}
        </p>

        <template v-if="!isModeAffichageMobile && profil">
            <m-button
                class="pp-entete__bouton-bandeau"
                :skin="mButtonSkin.Secondary"
                :disabled="!profil.liens && !profil.liens[0]"
                @click="ouvrirApercuEmployeur()"
            >
                {{profil.liens[0].titre}}
            </m-button>
            <m-button
                class="pp-entete__bouton-bandeau"
                :skin="mButtonSkin.Secondary"
                :disabled="!profil.liens && !profil.liens[1]"
                @click="ouvrirGenererCV()"
            >
                {{profil.liens[1].titre}}
            </m-button>
        </template>
        <template v-else-if="profil">
            <m-icon-button
                class="pp-entete__bouton-bandeau"
                :mode="mLinkMode.Button"
                icon-name="m-svg__show"
                icon-size="24px"
                button-size="24px"
                :disabled="!profil.liens && !profil.liens[0]"
                @click="ouvrirApercuEmployeur()"
            ></m-icon-button>
            <m-link
                class="pp-entete__bouton-bandeau"
                :mode="mLinkMode.Button"
                :disabled="!profil.liens && !profil.liens[1]"
                @click="ouvrirGenererCV()"
            >
                <m-icon-file
                    class="pp-entete__icone-fichier-bandeau"
                    extension="doc"
                ></m-icon-file>
            </m-link>
        </template>
        <button
            v-if="hasAccesSiteAdmin"
            class="pp-entete__bouton-admin"
            @click="naviguerSiteAdmin()"
        >
            <m-icon
                class="pp-entete__icone-bouton-admin"
                name="pp-svg__task-list-settings"
            ></m-icon>
            <span
                v-if="!isModeAffichageMobile"
                class="pp-entete__texte-bouton-admin"
            >
                {{'entete:bouton-admin' | translate}}
            </span>
        </button>
    </div>
    <div class="pp-entete__corps">
        <pp-profil class="pp-entete__profil" :profil="profil"></pp-profil>
        <pp-indicateur-progression
            v-if="isMqMinS"
            class="pp-entete__indicateur-progression"
            :etat-chargement="etatChargementProfil"
            :pourcentage-complete="pourcentageProfilComplete"
            :nombre-success-obtenus="nombreSuccessObtenus"
        ></pp-indicateur-progression>
    </div>
</div>
</template>

