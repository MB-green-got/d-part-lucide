# Le cadeau de départ de Lucie

Un petit site en quatre pages, publié gratuitement avec GitHub Pages. Les mots et les dates sont enregistrés dans Firebase, un service gratuit de Google.

| Page | Pour qui |
|---|---|
| `/` | Le site cadeau de Lucie, écran par écran |
| `/date/` | Le sondage de dates, pour Lucie et les copines |
| `/carte-equipe-q5yfzfdu/` | La carte où l'équipe écrit ses mots. Aucune page ne fait de lien vers elle. |
| `/admin/` | La modération du mur et les dates du sondage, réservées à ton compte Google |

Les mots écrits sur la carte arrivent tout seuls sur le mur du site de Lucie, avec une photo si la personne en a ajouté une. Personne n'a de compte à créer : chaque navigateur reçoit un identifiant anonyme et ne peut modifier que son propre post it ou ses propres dates.

Le projet Firebase s'appelle « Lucie's leaving » (identifiant `lucie-s-leaving`) et reste sur l'offre gratuite Spark. Les photos sont réduites par le navigateur, puis enregistrées dans Firestore avec le mot.

## Ce qu'il y a dans le dossier

```
docs/                       le site publié par GitHub Pages
  index.html                le site cadeau
  date/index.html           le sondage de dates
  carte-equipe-q5yfzfdu/    la carte de l'équipe
  admin/index.html          la modération
  js/config.js              la configuration Firebase du projet lucie-s-leaving
  js/base.js                la connexion à Firebase, commune à toutes les pages
  assets/lucie.jpg          la photo de Lucie
  assets/photos/            les autres photos du mur
firestore.rules             les règles de sécurité de la base
firebase.json               indique où sont les règles, et règle les tests en local
.firebaserc                 choisit lucie-s-leaving comme projet par défaut
```

## Mise en ligne, pas à pas

### Déjà fait dans la console Firebase

- Le projet `lucie-s-leaving` sur l'offre gratuite Spark.
- L'application web « Cadeau Lucie », dont la configuration est dans `docs/js/config.js`. Ces valeurs ne sont pas secrètes, la sécurité vient des règles.
- Les connexions **Anonyme** et **Google** dans Authentication.
- La base Firestore `(default)` en mode production, région `eur3`.

### 1. Publier les règles

Dans le terminal de VS Code, à la racine du dépôt :

```sh
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules
```

La première commande ouvre le navigateur pour te connecter avec ton compte Google. La seconde envoie `firestore.rules` au projet `lucie-s-leaving`, choisi par `.firebaserc`. Relance la seulement si tu modifies les règles.

### 2. Publier sur GitHub Pages

1. Dans VS Code, ouvre l'onglet **Contrôle de code source**, écris un message comme « Mise en ligne », clique sur **Valider**, puis sur **Synchroniser les modifications**.
2. Sur GitHub, ouvre le dépôt `d-part-lucide`, puis **Settings** et **Pages**.
3. Dans **Source**, choisis **Deploy from a branch**. Dans **Branch**, choisis `main` puis le dossier `/docs`, et clique sur **Save**.
4. Une à deux minutes plus tard, GitHub affiche l'adresse du site, `https://mb-green-got.github.io/d-part-lucide/`.

Sur un compte GitHub gratuit, le dépôt doit être **public** pour que Pages fonctionne. Le nom du dossier de la carte se voit donc dans le dépôt : Lucie ne tombera pas dessus par hasard, mais elle pourrait le trouver en fouillant le dépôt.

### 3. Autoriser l'adresse du site

1. Dans Firebase, ouvre **Authentication**, puis l'onglet **Paramètres** et **Domaines autorisés**.
2. Clique sur **Ajouter un domaine** et saisis `mb-green-got.github.io`.

Sans cette étape, la page admin ne peut pas te connecter avec Google.

### 4. Devenir admin

Ouvre `https://mb-green-got.github.io/d-part-lucide/admin/` et clique sur **Me connecter avec Google**. Tant que tu n'es pas admin, la page affiche ton identifiant (ton uid) avec un bouton **Copier mon identifiant**. Clique dessus, puis crée le document `admins/TON_UID` dans la console :

1. Dans [la console Firebase](https://console.firebase.google.com/project/lucie-s-leaving/firestore), ouvre **Firestore Database**, onglet **Données**, et clique sur **Commencer une collection**.
2. Saisis `admins` comme identifiant de la collection, puis clique sur **Suivant**.
3. Colle ton uid dans **Identifiant du document**, ajoute un champ `note` de type `string` avec la valeur `moi`, puis clique sur **Enregistrer**.

Recharge la page admin. Tous les mots apparaissent avec un bouton **Retirer ce mot**, ainsi que la section **Les dates du sondage**.

Il n'y a aucune clé à cacher : seul un compte listé dans `admins` peut retirer ou modifier le mot d'un autre, et ajouter des dates.

### 5. Ajouter les dates du sondage

La base est vide au départ, et les règles interdisent au public de créer des dates. Sur la page admin, clique une seule fois sur **Ajouter les créneaux de départ**. Les 7 créneaux sont enregistrés d'un coup :

- jeudi 29 octobre 2026, en soirée
- samedi 31 octobre, l'après midi
- mardi 3 novembre, en soirée
- jeudi 5 novembre, en soirée
- samedi 7 novembre, l'après midi
- jeudi 12 novembre, en soirée
- samedi 14 novembre, l'après midi

Le bouton disparaît quand les 7 sont là. Pour une date de plus, utilise **Proposer une autre date** juste en dessous.

### 6. Ajouter des photos au mur (facultatif)

Chaque personne de l'équipe peut joindre une photo à son mot, directement sur la carte. Elle s'affiche en polaroïd juste après son post it. Tu peux aussi ajouter tes propres photos :

1. Dépose les photos dans `docs/assets/photos/`, en `.jpg` de moins de 500 Ko de préférence.
2. Dans `docs/index.html`, cherche `mur: [` et ajoute une ligne par photo, par exemple
   `{ type: "photo", src: "assets/photos/pot-de-depart.jpg", legende: "" },`
3. Valide et synchronise dans VS Code. Le site se met à jour en une à deux minutes.

La photo de Lucie reste en premier. Les post it et les photos s'affichent ensuite en alternance.

## Les trois adresses à envoyer

- **À Lucie, le site cadeau** : `https://mb-green-got.github.io/d-part-lucide/`
- **À Lucie et aux copines, le sondage** : `https://mb-green-got.github.io/d-part-lucide/date/`
- **À l'équipe seulement, la carte** : `https://mb-green-got.github.io/d-part-lucide/carte-equipe-q5yfzfdu/`

## La sécurité, en bref

- Chaque écriture est vérifiée par les règles Firebase, pas seulement dans le navigateur : prénom de 40 caractères au plus, message de 280 au plus, couleur parmi citron, rose, menthe, mandarine et argile, photo de moins de 950 000 caractères, dates au bon format, moment parmi les quatre proposés.
- Seuls les visiteurs connectés en anonyme peuvent coller un mot ou cocher des dates. Tout le monde peut lire. Un mot ne peut être modifié ou retiré que par son auteur ou par un admin. Seuls les admins ajoutent des dates au sondage.
- Avant l'envoi, le navigateur réduit la photo à 1200 pixels sur le plus grand côté, en JPEG de qualité 0,7. Si elle dépasse encore 700 Ko, il baisse la qualité par paliers. Elle est enregistrée en base64 dans le champ `photo` du mot, qui reste ainsi sous la limite de 1 Mo par document.
- Chaque navigateur ne peut écrire que 10 fois par minute.
- Un champ caché piège les robots qui remplissent tous les champs.
- Tous les textes saisis sont affichés comme du texte, jamais comme du code.
- Toutes les pages demandent aux moteurs de recherche de ne pas les indexer.
- L'identifiant anonyme est gardé par Firebase dans le navigateur. Si quelqu'un change de téléphone ou vide son navigateur, il ne pourra plus modifier son ancien mot, mais il peut simplement en écrire un nouveau. L'ancien peut être retiré depuis la page admin.

L'offre gratuite de Firebase permet 50 000 lectures et 20 000 écritures par jour, bien plus que ce qu'il faut pour un pot de départ. Les photos voyagent avec les mots : avec une quarantaine de photos, chaque ouverture du mur télécharge environ 15 Mo, et l'offre gratuite en permet 10 Go par mois.

## Tester en local (facultatif)

Il faut Node.js et Java 11 ou plus récent. Les émulateurs lisent les mêmes `firestore.rules`.

```sh
npx firebase-tools emulators:start --only auth,firestore --project demo-lucie
```

Dans un autre terminal, à la racine du dépôt :

```sh
mkdir -p /tmp/lucie && ln -sfn "$PWD/docs" /tmp/lucie/d-part-lucide
python3 -m http.server 5500 --directory /tmp/lucie
```

Ouvre ensuite `http://localhost:5500/d-part-lucide/`. En local, les pages parlent aux émulateurs et jamais au vrai projet. Les données s'effacent quand tu arrêtes les émulateurs.

Pour devenir admin en local, connecte toi sur `/admin/` avec un compte inventé par l'émulateur, puis crée `admins/TON_UID` :

```sh
curl -X POST "http://127.0.0.1:8085/v1/projects/demo-lucie/databases/(default)/documents/admins?documentId=TON_UID" \
  -H "Authorization: Bearer owner" -H "Content-Type: application/json" -d '{"fields":{"note":{"stringValue":"moi"}}}'
```
