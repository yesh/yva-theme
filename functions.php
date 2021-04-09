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


// hide menu items
add_action('admin_menu', function() {
  // remove_menu_page('edit.php');
});

// full quality jpeg upload
// add_filter('jpeg_quality', function($arg) { return 100; });
// add_filter('wp_editor_set_quality', function($arg) { return 100; });
// add_filter('big_image_size_threshold', function ($threshold) {
// 	return 6000;
// }, 100, 1);

// remove emojis
function disable_emojis() {
  remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
  remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
  remove_action( 'wp_print_styles', 'print_emoji_styles' );
  remove_action( 'admin_print_styles', 'print_emoji_styles' );	
  remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
  remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );	
  remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
  
  add_filter( 'tiny_mce_plugins', 'disable_emojis_tinymce' );
}
add_action( 'init', 'disable_emojis' );
function disable_emojis_tinymce( $plugins ) {
  if ( is_array( $plugins ) ) {
    return array_diff( $plugins, array( 'wpemoji' ) );
  } else {
    return array();
  }
}

// remove manifests
remove_action('wp_head', 'wlwmanifest_link');

// disable gutemberg
add_filter('use_block_editor_for_post_type', '__return_false', 10);
add_action( 'wp_enqueue_scripts', 'remove_block_css', 100 );
function remove_block_css() {
  wp_dequeue_style( 'wp-block-library' ); // WordPress core
  wp_dequeue_style( 'wp-block-library-theme' ); // WordPress core
  wp_dequeue_style( 'wc-block-style' ); // WooCommerce
  wp_dequeue_style( 'storefront-gutenberg-blocks' ); // Storefront theme
}

// disable comments
function df_disable_comments_post_types_support() {
  $post_types = get_post_types();
  foreach ($post_types as $post_type) {
     if(post_type_supports($post_type, 'comments')) {
        remove_post_type_support($post_type, 'comments');
        remove_post_type_support($post_type, 'trackbacks');
     }
  }
}

add_action('admin_init', 'df_disable_comments_post_types_support');

function df_disable_comments_status() {
  return false;
}
add_filter('comments_open', 'df_disable_comments_status', 20, 2);
add_filter('pings_open', 'df_disable_comments_status', 20, 2);

function df_disable_comments_hide_existing_comments($comments) {
  $comments = array();
  return $comments;
}
add_filter('comments_array', 'df_disable_comments_hide_existing_comments', 10, 2);


// remove w3 total cache comment
add_filter( 'w3tc_can_print_comment', function( $w3tc_setting ) { return false; }, 10, 1 );

// activate acf folder
add_filter('acf/settings/save_json', function ($path) {
  $path = get_stylesheet_directory() . '/acf-json';
  return $path;
});