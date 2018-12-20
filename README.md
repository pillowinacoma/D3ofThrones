# LIFProjet 2018

## Index

1. [Introduction](#introduction)
    * [Équipe](#equipe)
    * [Encadrant](#encadrant)
    * [Objectif](#objectif)
    * [Compétences visées](#competences-visees)
    * [Réalisation](#realisation)
1. [Notre travail](#notre-travail)
    * [Graphes](#graphes)
    * [Interface](#interface)
1. [Présentation du projet](#presentation-du-projet)
    * [Installation](#installation)
    * [Guide utilisateurs](#guide-utilisateur)

<a name="introduction"></a>
## Introduction


[//]: # "{{{"

<a name="equipe"></a>
### Équipe

Equipe :
- LAMBERT Timothée
- DERBAL Younes
- SBAAI Abdelaziz (pillowinacoma)


<a name="encadrant"></a>
### Encadrant

- Encadrant : remy.cazabet@univ-lyon1.fr
- Présence de l'encadrant : tous les mardi après-midi

<a name="objectif"></a>
### Objectif

RC3. Implémentation d’un outil de visualisation de l’évolution de réseaux dynamiques en langages web
- http://perso.univ-lyon1.fr/fabien.rico/site/projet:sujets2018printemps#rc3_implementation_d_un_outil_de_visualisation_de_l_evolution_de_reseaux_dynamiques_en_langages_web


<a name="competences-visees"></a>
### Compétences visées

- Langages Web : HTML, CSS, JS, PHP
- Langage Orienté Objet : Python
- Apprendre à gérer des graphes avec JSNetworkX et D3


<a name="realisation"></a>
### Réalisation

Les étapes du projet :
- 1) Se familiariser avec
    - javascript, D3, jsnetworkx.
    - lire un peu sur l’analyse de réseaux sociaux (https://fr.wikipedia.org/wiki/Analyse_des_réseaux_sociaux), et idéalement la science des réseaux (https://en.wikipedia.org/wiki/Network_science) pour avoir un peu de background, ainsi que quelques cas sur Game of thrones pour se faire une idée de ce qui peut être intéressant : (https://datascienceplus.com/network-analysis-of-game-of-thrones/ , https://www.macalester.edu/~abeverid/thrones.html )

- 2) Se lancer dans le code.
    - Charger 1 fichier de réseau de GOT et l’afficher.
    - Ajouter des couleurs/taille de nœuds en fonction de propriétés de réseaux (centralisé, communautés, ancienneté…)
    - Charger 2 réseaux successifs différents et gérer la transition d’affichage entre les 2
    - Charger tous les réseaux et voir donc la “vidéo” de l’évolution du réseau
    - Voir que c’est pas terrible parce qu’on ne voit rien et ça bouge de partout (instable, lent …)
    - Régler tous ces problèmes jusqu’à avoir un beau réseau qui évolue :)

- 3) Pour des raisons techniques, vous risquez aussi à un moment de vouloir calculer des indicateurs de réseaux qui ne sont pas dans jsnetworkx. 2 solutions : vous les recodez en JS (pas évident), ou vous utilisez la librairie python networkx et vous gérer l’interfacage python/js .

- 4)
    Tâches : <br/>
    1 graphes qui evolue dans le temps : <br/>
    Afficher le graphe par scene (Toute les 10 scène) 				1<br/>
    	Choisir la scène<br/>
    Afficher le graphe dans le temps								2<br/>
    	Aller en avant<br/>
    	Pause<br/>
    	aller en arrière<br/>
    	accellerer\decellerer<br/>
    	Revenir au debut <br/>
    Afficher uniquement les X personnages les plus importants		4<br/>
    Afficher les personnages souhaités								6<br/>
    Afficher les personnages les moins importants					8<br/>
    Mettre en avant les relations importantes						3<br/>
    Afficher les relations de X au click							7<br/>
    	Trier en fonction du personnage (Redimmensionner) <br/>
    Graphes auxiliaires												10<br/>
    	Apparitions de chaques personnages en fonction<br/>

    Traitements des données											10bis<br/>
    	Personne n’apparait plus ou nouveau personnages<br/>

    http://bl.ocks.org/mbostock/1153292

[//]: # "}}}"


<a name="notre-travail"></a>
## Notre travail


[//]: # "{{{"

<a name="graphes"></a>
### Graphes

- Mise en place d'un script python permettant de transformer un fichier.graphml en fichier.JSON adapté à l'utilisation pour JSNetworkX et D3
- Récupération de la liste des fichiers de données au format JSON
- Création d'un graphe avec JSNetworkX
    - Création des noeuds
    - Création des liens entre les noeuds
    - Mise a jour du graph en fonction du fichier chargé
    - Pour le graphe cumulé, ajout d'un lien toutes les x secondes puis mise a jour de l'affichage

- Affichage du graphe avec D3
    - Affichage d'un graphe par épisode ou d'un graphe cumulé
    - Affichage des noeuds ayant plus de x voisins
    - Coloration des noeuds en fonction des voisins/de l'ancienneté
    - Affichage de la photo du personnage en cas de clique sur un noeud


<a name="interface"></a>
### Interface

- Utilisation des frameworks Bootstrap et JQuery pour la mise en place de l'apparence du site
    - En-tête
    - Barre de navigation
    - Pied de page
    - Responsive Design
    - Ergonomie

- Mise en place de la fenêtre permettant de visualiser la photo du personnage en utilisant du JavaScript et D3
    - Récupération de l'ID du noeud correspondant au personnage
    - Vérification de l'existance de la photo du personnage dans le répertoire en fonction de son nom et de la série
        - Si la photo existe, alors on l'afficher avec le nom du personnage
        - Sinon on affiche une iconne standard avec le nom du personnage

[//]: # "}}}"



<a name="presentation-du-projet"></a>
## Présentation du projet


[//]: # "{{{"

<a name="installation"></a>
### Installation

Si vous installez notre projet en local, installez sur votre machine LAMP / WAMP / MAMP en fonction de votre système d'exploitation.
Ce sera inspensable pour pouvoir visualiser les graphes puisque nous avons eu recours à du php.

<a name="guide-utilisateurs"></a>
### Guide utilisateur

Plan du site web :
- index.html
- BB.html
- GoT.html
- HoC.html

Sur la page d'accueil vous avez accès à
- pourquoi nous avons choisi ce projet
- le sujet de notre projet
- un lien en un clique sur chacune des séries (en cliquant sur le logo)

Sur les pages des séries vous avez accès à
- un résumé de la série par saison
- un graphes dynamique permettant une visualisation
    - par épisode
    - en cumulé avec des paramètres de tailles et de couleurs de noeuds selon le nombre de voisins ou l'ancienneté des personnages
- une petite fênetre permettant d'afficher la photo et le nom des personnages lorsque l'on clique sur un noeud du graphe

[//]: # "}}}"
