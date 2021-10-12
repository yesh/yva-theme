<?php

// Template name: Landing

$context = Timber::context();

$timber_post     = new Timber\Post();
$context['post'] = $timber_post;
Timber::render( array( 'page-homepage.twig', 'page.twig' ), $context );
