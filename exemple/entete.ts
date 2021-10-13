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
import WithRender from './entete.html?style=./entete.scss';

const moduleProfil = namespace('profil');
const moduleAdmin = namespace('admin');

@WithRender
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
