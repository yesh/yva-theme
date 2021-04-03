<?php

if (!class_exists('Timber')) {
  add_action(
    'admin_notices',
    function() {
      echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php' ) ) . '</a></p></div>';
    }
  );
  add_filter(
    'template_include',
    function( $template ) {
      return get_stylesheet_directory() . '/static/no-timber.html';
    }
  );
  return;
}

Timber::$dirname = array( 'templates', 'views' );

class SiteName extends Timber\Site {
  public function __construct() {
    add_action('after_setup_theme', array($this, 'theme_supports'));
    add_filter('timber/context', array($this, 'add_to_context'));
    add_filter('timber/twig', array($this, 'add_to_twig'));
    parent::__construct();
  }

  public function add_to_context( $context ) {
    $context['menu']  = new Timber\Menu();
    $context['site']  = $this;
    return $context;
  }
  public function theme_supports() {
    // add_theme_support('automatic-feed-links');
    // add_theme_support( 'post-thumbnails' );
    add_theme_support('menus');
  }
  public function add_to_twig( $twig ) {
    $twig->addExtension( new Twig\Extension\StringLoaderExtension() );
    return $twig;
  }
}

new SiteName();
