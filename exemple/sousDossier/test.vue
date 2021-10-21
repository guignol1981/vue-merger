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

<script lang="ts">
import { PPNomsRoutes } from '@mpo-spla-ui/router';
import {
    ACTION_OBTENIR_GESTIONNAIRE_ACCES,
    GETTER_GESTIONNAIRE_ACCES,
    PPAdminAcces,
    PPGestionnaireAcces,
} from '@mpo-spla-ui/store/modules/admin/admin-def';
import {
    ACTION_OBTENIR_PROFIL,
    GETTER_ETAT_CHARGEMENT_PROFIL,
    GETTER_PROFIL,
    Profil,
} from '@mpo-spla-ui/store/modules/profil/profil-def';
import { PPChargementEtats } from '@mpo-spla-ui/utils/ordonnanceur-chargement';
import PPVue from '@mpo-spla-ui/utils/vue';
import { MButtonSkin } from '@ulaval/modul-components/dist/components/button/button';
import { MLinkMode } from '@ulaval/modul-components/dist/components/link/link';
import { MediaQueries } from '@ulaval/modul-components/dist/mixins/media-queries/media-queries';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import PPIndicateurProgression from '../indicateur-progression/indicateur-progression';
import PPProfil from './composants/profil/profil';

const moduleProfil = namespace('profil');
const moduleAdmin = namespace('admin');

@Component({
    components: {
        'pp-profil': PPProfil,
        'pp-indicateur-progression': PPIndicateurProgression,
    },
    mixins: [MediaQueries],
})
export default class PPEntete extends PPVue {
    @moduleProfil.Getter(GETTER_PROFIL)
    public profil!: Profil;

    @moduleProfil.Getter(GETTER_ETAT_CHARGEMENT_PROFIL)
    public etatChargementProfil!: PPChargementEtats;

    @moduleAdmin.Getter(GETTER_GESTIONNAIRE_ACCES)
    public gestionnaireAcces!: PPGestionnaireAcces;

    @moduleProfil.Action(ACTION_OBTENIR_PROFIL)
    private obtenirProfil!: () => void;

    @moduleAdmin.Action(ACTION_OBTENIR_GESTIONNAIRE_ACCES)
    public obtenirGestionnaireAcces!: (idul: string) => void;

    public ppChargementEtats = PPChargementEtats;
    public mButtonSkin = MButtonSkin;
    public mLinkMode = MLinkMode;

    protected mounted(): void {
        this.obtenirProfil();
        this.obtenirGestionnaireAcces(
            this.$shell.$securite.getUtilisateur(true).identifiant
        );
    }

    public get pourcentageProfilComplete(): number {
        return this.profil && this.profil.progression
            ? this.profil.progression
            : 0;
    }

    public get nombreSuccessObtenus(): number {
        return this.profil && this.profil.succes ? this.profil.succes : 0;
    }

    public get hasAccesSiteAdmin(): boolean {
        return (
            this.gestionnaireAcces &&
            ((this.gestionnaireAcces.gestionnaires! &&
                this.gestionnaireAcces.gestionnaires !== PPAdminAcces.Aucun) ||
                (this.gestionnaireAcces.groupe_etudiants! &&
                    this.gestionnaireAcces.groupe_etudiants !==
                        PPAdminAcces.Aucun))
        );
    }

    public naviguerSiteAdmin(): void {
        this.$router.push({ name: PPNomsRoutes.Admin });
    }

    public ouvrirApercuEmployeur(): void {
        if (!this.profil) {
            return;
        }

        this.ouvrirUrlDansNouvelleOnglet(this.profil.liens![0].url!);
    }

    public ouvrirGenererCV(): void {
        if (!this.profil) {
            return;
        }

        this.ouvrirUrlDansNouvelleOnglet(this.profil.liens![1].url!);
    }
}
</script>

