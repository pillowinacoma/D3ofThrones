# LIFProjet Automne 2018

## Index

1. [Introduction](#introduction)
    * [Équipe](#equipe)
    * [Encadrant](#encadrant)
    * [Objectif](#objectif)
    * [Compétences visées](#competences-visees)
    * [Réalisation](#realisation)
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
- http://perso.univ-lyon1.fr/fabien.rico/site/projet:2018:aut:sujets#rc3_implementation_d_un_outil_de_visualisation_de_l_evolution_de_reseaux_dynamiques_en_langages_web


<a name="competences-visees"></a>
### Compétences visées

- Langages Web : HTML, CSS, JavaScript, PHP, JQuery
- Apprendre à réaliser et manipuler des représentations graphiques de données en utilisant D3.js


<a name="realisation"></a>
### Réalisation

Les étapes du projet :
- 1) Apprendre à utiliser l'outil D3js

- 2) Tâches à réaliser
    - Afficher un graphe de réseau dynamique.
    - Évolution dans le temps
    - Mettre en avant les relations importantes en ajoutant des couleurs/taille de nœuds en fonction du poids du noeud/lien.
    - Afficher uniquement X% des personnages importants du graphe
    - Sélectionner/désélectionner les personnages à afficher
    - Afficher les relations de X au clic
    - Régler tous ces problèmes jusqu’à avoir un beau réseau qui évolue :)


[//]: # "}}}"



<a name="presentation-du-projet"></a>
## Présentation du projet


[//]: # "{{{"

<a name="installation"></a>
### Installation

Si vous utilisez notre programme en local, vous allez avoir besoin d'un serveur local, vu qu'on utilise du PHP pour parcourir les fichiers, vous pouvez vous renseigner sur ça en fonction de votre système d'exploitation (Apache, serveur PHP, serveur Python ...)

<a name="guide-utilisateurs"></a>
### Guide utilisateur

<<<<<<< HEAD
  - Dans notre projet on c'est concentré plus sur le programme qui gère les graphes que sur une interface, c.à.d que si vous voulez changer de fichiers, il va vous falloir changer la source des données dans la 17ème ligne du fichier js/graphDisplay.js, vous trouvez dans le répertoire data 3 exemples de répertoires source.
  - Notre programme est composé de 2 parties principales, le svg qui est la sortie de notre programme, et l'ensemble des entrées qui permettent de gérer l'affiche :
      + En bas la page, vous allez trouvez le slider qui permet de changer la le fichier/scène
      + À gauche, vous trouverez un champ pour changer le pourcentage affiché des personnages du graphe
      + Vous trouverez aussi une liste des nœuds/personnages que vous pouvez utiliser pour sélectionner/désélectionner des nœuds
      + Un clic sur un nœud va mettre en avant les nœuds "voisins" du nœud sélectionné, si vous recliquez sur le même nœud vous aller retourner à un affichage régulier.




[//]: # "}}}"
