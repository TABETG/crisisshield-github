package com.crisisshield.crisisshieldbackend.assistant;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class PiiMaskerTest {

    private final PiiMasker masker = new PiiMasker();

    @Test
    @DisplayName("Courriel, telephone, IBAN et NIR sont neutralises avant envoi")
    void masqueLesQuatreTypes() {
        String texte = "Contacter jean.dupont@exemple.fr ou 06 12 34 56 78. IBAN FR76 3000 6000 0112 3456 7890 189. "
                + "NIR 1 85 05 78 006 084 36.";
        PiiMasker.Masked m = masker.mask(texte);

        assertThat(m.text()).doesNotContain("jean.dupont@exemple.fr", "06 12 34 56 78", "FR76 3000", "1 85 05 78");
        assertThat(m.text()).contains("[[EMAIL_1]]", "[[TELEPHONE_1]]", "[[IBAN_1]]");
        assertThat(m.count()).isGreaterThanOrEqualTo(3);
    }

    @Test
    @DisplayName("Le NIR est detecte quand il est ecrit sans espaces")
    void nirCompact() {
        PiiMasker.Masked m = masker.mask("Le numero est 185057800608436.");
        assertThat(m.text()).contains("[[NIR_1]]");
        assertThat(m.text()).doesNotContain("185057800608436");
    }

    @Test
    @DisplayName("Une meme valeur recoit le meme marqueur, et la restauration est exacte")
    void marqueurStableEtRestauration() {
        String texte = "Envoyer a alice@a.test puis relancer alice@a.test si silence.";
        PiiMasker.Masked m = masker.mask(texte);
        assertThat(m.text()).isEqualTo("Envoyer a [[EMAIL_1]] puis relancer [[EMAIL_1]] si silence.");
        assertThat(m.count()).isEqualTo(1);

        String reponseModele = "Il faut prevenir [[EMAIL_1]] en priorite.";
        assertThat(m.restore(reponseModele)).isEqualTo("Il faut prevenir alice@a.test en priorite.");
    }

    @Test
    @DisplayName("Un texte sans donnee personnelle ressort intact")
    void texteIntact() {
        String texte = "Isoler le serveur de fichiers et notifier la cellule de crise.";
        assertThat(masker.mask(texte).text()).isEqualTo(texte);
        assertThat(masker.mask(texte).count()).isZero();
    }

    @Test
    @DisplayName("Numeros de telephone : formats +33 et separateurs varies")
    void formatsTelephone() {
        assertThat(masker.mask("+33 6 12 34 56 78").text()).contains("[[TELEPHONE_1]]");
        assertThat(masker.mask("01.23.45.67.89").text()).contains("[[TELEPHONE_1]]");
        assertThat(masker.mask("0612345678").text()).contains("[[TELEPHONE_1]]");
    }
}
