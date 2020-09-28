<?php return array (
  'app' => 
  array (
    'name' => 'Climbers guide',
    'env' => 'production',
    'debug' => false,
    'url' => 'http://localhost',
    'timezone' => 'Europe/Zagreb',
    'locale' => 'en',
    'fallback_locale' => 'en',
    'key' => 'base64:2y/BBvbBurEIN6msWfj91zDean8Tr4itkVIebUkAWMU=',
    'cipher' => 'AES-256-CBC',
    'providers' => 
    array (
      0 => 'Illuminate\\Auth\\AuthServiceProvider',
      1 => 'Illuminate\\Broadcasting\\BroadcastServiceProvider',
      2 => 'Illuminate\\Bus\\BusServiceProvider',
      3 => 'Illuminate\\Cache\\CacheServiceProvider',
      4 => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
      5 => 'Illuminate\\Cookie\\CookieServiceProvider',
      6 => 'Illuminate\\Database\\DatabaseServiceProvider',
      7 => 'Illuminate\\Encryption\\EncryptionServiceProvider',
      8 => 'Illuminate\\Filesystem\\FilesystemServiceProvider',
      9 => 'Illuminate\\Foundation\\Providers\\FoundationServiceProvider',
      10 => 'Illuminate\\Hashing\\HashServiceProvider',
      11 => 'Illuminate\\Mail\\MailServiceProvider',
      12 => 'Illuminate\\Notifications\\NotificationServiceProvider',
      13 => 'Illuminate\\Pipeline\\PipelineServiceProvider',
      14 => 'Illuminate\\Queue\\QueueServiceProvider',
      15 => 'Illuminate\\Session\\SessionServiceProvider',
      16 => 'Illuminate\\Validation\\ValidationServiceProvider',
      17 => 'Illuminate\\View\\ViewServiceProvider',
      18 => 'Clockwork\\Support\\Laravel\\ClockworkServiceProvider',
      19 => 'App\\Providers\\AppServiceProvider',
      20 => 'App\\Providers\\AuthServiceProvider',
      21 => 'App\\Providers\\EventServiceProvider',
      22 => 'App\\Providers\\RouteServiceProvider',
    ),
    'aliases' => 
    array (
      'App' => 'Illuminate\\Support\\Facades\\App',
      'Artisan' => 'Illuminate\\Support\\Facades\\Artisan',
      'Auth' => 'Illuminate\\Support\\Facades\\Auth',
      'Blade' => 'Illuminate\\Support\\Facades\\Blade',
      'Broadcast' => 'Illuminate\\Support\\Facades\\Broadcast',
      'Bus' => 'Illuminate\\Support\\Facades\\Bus',
      'Cache' => 'Illuminate\\Support\\Facades\\Cache',
      'Config' => 'Illuminate\\Support\\Facades\\Config',
      'Cookie' => 'Illuminate\\Support\\Facades\\Cookie',
      'Crypt' => 'Illuminate\\Support\\Facades\\Crypt',
      'DB' => 'Illuminate\\Support\\Facades\\DB',
      'Eloquent' => 'Illuminate\\Database\\Eloquent\\Model',
      'Event' => 'Illuminate\\Support\\Facades\\Event',
      'File' => 'Illuminate\\Support\\Facades\\File',
      'Gate' => 'Illuminate\\Support\\Facades\\Gate',
      'Hash' => 'Illuminate\\Support\\Facades\\Hash',
      'Lang' => 'Illuminate\\Support\\Facades\\Lang',
      'Log' => 'Illuminate\\Support\\Facades\\Log',
      'Mail' => 'Illuminate\\Support\\Facades\\Mail',
      'Notification' => 'Illuminate\\Support\\Facades\\Notification',
      'Password' => 'Illuminate\\Support\\Facades\\Password',
      'Queue' => 'Illuminate\\Support\\Facades\\Queue',
      'Redirect' => 'Illuminate\\Support\\Facades\\Redirect',
      'Redis' => 'Illuminate\\Support\\Facades\\Redis',
      'Request' => 'Illuminate\\Support\\Facades\\Request',
      'Response' => 'Illuminate\\Support\\Facades\\Response',
      'Route' => 'Illuminate\\Support\\Facades\\Route',
      'Schema' => 'Illuminate\\Support\\Facades\\Schema',
      'Session' => 'Illuminate\\Support\\Facades\\Session',
      'Storage' => 'Illuminate\\Support\\Facades\\Storage',
      'URL' => 'Illuminate\\Support\\Facades\\URL',
      'Validator' => 'Illuminate\\Support\\Facades\\Validator',
      'View' => 'Illuminate\\Support\\Facades\\View',
      'Clockwork' => 'Clockwork\\Support\\Laravel\\Facade',
    ),
  ),
  'auth' => 
  array (
    'defaults' => 
    array (
      'guard' => 'web',
      'passwords' => 'users',
    ),
    'guards' => 
    array (
      'web' => 
      array (
        'driver' => 'session',
        'provider' => 'users',
      ),
      'api' => 
      array (
        'driver' => 'session',
        'provider' => 'users',
      ),
    ),
    'providers' => 
    array (
      'users' => 
      array (
        'driver' => 'eloquent',
        'model' => 'App\\User',
      ),
    ),
    'passwords' => 
    array (
      'users' => 
      array (
        'provider' => 'users',
        'table' => 'password_resets',
        'expire' => 60,
      ),
    ),
  ),
  'broadcasting' => 
  array (
    'default' => 'log',
    'connections' => 
    array (
      'pusher' => 
      array (
        'driver' => 'pusher',
        'key' => '',
        'secret' => '',
        'app_id' => '',
        'options' => 
        array (
          'cluster' => 'mt1',
          'encrypted' => true,
        ),
      ),
      'redis' => 
      array (
        'driver' => 'redis',
        'connection' => 'default',
      ),
      'log' => 
      array (
        'driver' => 'log',
      ),
      'null' => 
      array (
        'driver' => 'null',
      ),
    ),
  ),
  'cache' => 
  array (
    'default' => 'file',
    'stores' => 
    array (
      'apc' => 
      array (
        'driver' => 'apc',
      ),
      'array' => 
      array (
        'driver' => 'array',
        'serialize' => false,
      ),
      'database' => 
      array (
        'driver' => 'database',
        'table' => 'cache',
        'connection' => NULL,
      ),
      'file' => 
      array (
        'driver' => 'file',
        'path' => '/opt/www/climb/api/storage/framework/cache/data',
      ),
      'memcached' => 
      array (
        'driver' => 'memcached',
        'persistent_id' => NULL,
        'sasl' => 
        array (
          0 => NULL,
          1 => NULL,
        ),
        'options' => 
        array (
        ),
        'servers' => 
        array (
          0 => 
          array (
            'host' => '127.0.0.1',
            'port' => 11211,
            'weight' => 100,
          ),
        ),
      ),
      'redis' => 
      array (
        'driver' => 'redis',
        'connection' => 'cache',
      ),
      'dynamodb' => 
      array (
        'driver' => 'dynamodb',
        'key' => NULL,
        'secret' => NULL,
        'region' => 'us-east-1',
        'table' => 'cache',
        'endpoint' => NULL,
      ),
    ),
    'prefix' => 'climbers_guide_cache',
  ),
  'clockwork' => 
  array (
    'enable' => false,
    'features' => 
    array (
      'cache' => 
      array (
        'enabled' => true,
        'collect_queries' => false,
      ),
      'database' => 
      array (
        'enabled' => true,
        'collect_queries' => true,
        'slow_threshold' => NULL,
        'slow_only' => false,
        'detect_duplicate_queries' => false,
      ),
      'emails' => 
      array (
        'enabled' => true,
      ),
      'events' => 
      array (
        'enabled' => true,
        'ignored_events' => 
        array (
        ),
      ),
      'log' => 
      array (
        'enabled' => false,
      ),
      'queue' => 
      array (
        'enabled' => false,
      ),
      'redis' => 
      array (
        'enabled' => false,
      ),
      'routes' => 
      array (
        'enabled' => false,
      ),
      'views' => 
      array (
        'enabled' => true,
        'collect_data' => false,
        'use_twig_profiler' => false,
      ),
    ),
    'web' => true,
    'artisan' => 
    array (
      'collect' => false,
      'except' => 
      array (
      ),
      'only' => 
      array (
      ),
      'collect_output' => false,
      'except_laravel_commands' => true,
    ),
    'queue' => 
    array (
      'collect' => true,
      'except' => 
      array (
      ),
      'only' => 
      array (
      ),
    ),
    'tests' => 
    array (
      'collect' => false,
      'except' => 
      array (
      ),
    ),
    'collect_data_always' => false,
    'storage' => 'files',
    'storage_files_path' => '/opt/www/climb/api/storage/clockwork',
    'storage_files_compress' => false,
    'storage_sql_database' => '/opt/www/climb/api/storage/clockwork.sqlite',
    'storage_sql_table' => 'clockwork',
    'storage_expiration' => 10080,
    'authentication' => false,
    'authentication_password' => 'VerySecretPassword',
    'filter_uris' => 
    array (
      0 => '/horizon/.*',
      1 => '/telescope/.*',
    ),
    'filter_methods' => 
    array (
      0 => 'options',
    ),
    'stack_traces' => 
    array (
      'enabled' => true,
      'skip_vendors' => 
      array (
      ),
      'skip_namespaces' => 
      array (
      ),
      'skip_classes' => 
      array (
      ),
      'limit' => 10,
    ),
    'serialization_depth' => 10,
    'serialization_blackbox' => 
    array (
      0 => 'Illuminate\\Container\\Container',
      1 => 'Illuminate\\Foundation\\Application',
      2 => 'Laravel\\Lumen\\Application',
    ),
    'register_helpers' => true,
    'headers' => 
    array (
    ),
    'server_timing' => 10,
  ),
  'database' => 
  array (
    'default' => 'pgsql',
    'connections' => 
    array (
      'sqlite' => 
      array (
        'driver' => 'sqlite',
        'database' => 'climb_new',
        'prefix' => '',
      ),
      'mysql' => 
      array (
        'driver' => 'mysql',
        'host' => '127.0.0.1',
        'port' => '5432',
        'database' => 'climb_new',
        'username' => 'climb_user',
        'password' => 'Aug1oovahdai4J',
        'unix_socket' => '',
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
        'prefix' => '',
        'strict' => true,
        'engine' => NULL,
      ),
      'pgsql' => 
      array (
        'driver' => 'pgsql',
        'host' => '127.0.0.1',
        'port' => '5432',
        'database' => 'climb_new',
        'username' => 'climb_user',
        'password' => 'Aug1oovahdai4J',
        'charset' => 'utf8',
        'prefix' => '',
        'schema' => 'public',
        'sslmode' => 'prefer',
      ),
      'sqlsrv' => 
      array (
        'driver' => 'sqlsrv',
        'host' => '127.0.0.1',
        'port' => '5432',
        'database' => 'climb_new',
        'username' => 'climb_user',
        'password' => 'Aug1oovahdai4J',
        'charset' => 'utf8',
        'prefix' => '',
      ),
    ),
    'migrations' => 'migrations',
    'redis' => 
    array (
      'client' => 'predis',
      'default' => 
      array (
        'host' => '127.0.0.1',
        'password' => NULL,
        'port' => '6379',
        'database' => 0,
      ),
    ),
  ),
  'filesystems' => 
  array (
    'default' => 'local',
    'cloud' => 's3',
    'disks' => 
    array (
      'local' => 
      array (
        'driver' => 'local',
        'root' => '/opt/www/climb/api/storage/app',
      ),
      'public' => 
      array (
        'driver' => 'local',
        'root' => '/opt/www/climb/api/storage/app/public',
        'url' => 'http://localhost/storage',
        'visibility' => 'public',
      ),
      'images' => 
      array (
        'driver' => 'local',
        'root' => '/opt/www/climb/api/storage/app/images',
        'number_of_folders' => 10,
      ),
      's3' => 
      array (
        'driver' => 's3',
        'key' => NULL,
        'secret' => NULL,
        'region' => NULL,
        'bucket' => NULL,
        'url' => NULL,
      ),
    ),
  ),
  'hashing' => 
  array (
    'driver' => 'bcrypt',
    'bcrypt' => 
    array (
      'rounds' => 10,
    ),
    'argon' => 
    array (
      'memory' => 1024,
      'threads' => 2,
      'time' => 2,
    ),
  ),
  'logging' => 
  array (
    'default' => 'stack',
    'channels' => 
    array (
      'stack' => 
      array (
        'driver' => 'stack',
        'channels' => 
        array (
          0 => 'daily',
        ),
      ),
      'single' => 
      array (
        'driver' => 'single',
        'path' => '/opt/www/climb/api/storage/logs/laravel.log',
        'level' => 'debug',
      ),
      'daily' => 
      array (
        'driver' => 'daily',
        'path' => '/opt/www/climb/api/storage/logs/laravel.log',
        'level' => 'debug',
        'days' => 7,
      ),
      'slack' => 
      array (
        'driver' => 'slack',
        'url' => NULL,
        'username' => 'Laravel Log',
        'emoji' => ':boom:',
        'level' => 'critical',
      ),
      'stderr' => 
      array (
        'driver' => 'monolog',
        'handler' => 'Monolog\\Handler\\StreamHandler',
        'with' => 
        array (
          'stream' => 'php://stderr',
        ),
      ),
      'syslog' => 
      array (
        'driver' => 'syslog',
        'level' => 'debug',
      ),
      'errorlog' => 
      array (
        'driver' => 'errorlog',
        'level' => 'debug',
      ),
    ),
  ),
  'mail' => 
  array (
    'driver' => 'smtp',
    'host' => '127.0.0.1',
    'port' => '25',
    'from' => 
    array (
      'address' => 'noreply@climb.mihainside.org',
      'name' => 'Climbers guide',
    ),
    'encryption' => NULL,
    'username' => NULL,
    'password' => NULL,
    'sendmail' => '/usr/sbin/sendmail -bs',
    'markdown' => 
    array (
      'theme' => 'default',
      'paths' => 
      array (
        0 => '/opt/www/climb/api/resources/views/vendor/mail',
      ),
    ),
  ),
  'queue' => 
  array (
    'default' => 'sync',
    'connections' => 
    array (
      'sync' => 
      array (
        'driver' => 'sync',
      ),
      'database' => 
      array (
        'driver' => 'database',
        'table' => 'jobs',
        'queue' => 'default',
        'retry_after' => 90,
      ),
      'beanstalkd' => 
      array (
        'driver' => 'beanstalkd',
        'host' => 'localhost',
        'queue' => 'default',
        'retry_after' => 90,
      ),
      'sqs' => 
      array (
        'driver' => 'sqs',
        'key' => 'your-public-key',
        'secret' => 'your-secret-key',
        'prefix' => 'https://sqs.us-east-1.amazonaws.com/your-account-id',
        'queue' => 'your-queue-name',
        'region' => 'us-east-1',
      ),
      'redis' => 
      array (
        'driver' => 'redis',
        'connection' => 'default',
        'queue' => 'default',
        'retry_after' => 90,
        'block_for' => NULL,
      ),
    ),
    'failed' => 
    array (
      'database' => 'pgsql',
      'table' => 'failed_jobs',
    ),
  ),
  'services' => 
  array (
    'mailgun' => 
    array (
      'domain' => NULL,
      'secret' => NULL,
    ),
    'ses' => 
    array (
      'key' => NULL,
      'secret' => NULL,
      'region' => 'us-east-1',
    ),
    'sparkpost' => 
    array (
      'secret' => NULL,
    ),
    'stripe' => 
    array (
      'model' => 'App\\User',
      'key' => NULL,
      'secret' => NULL,
    ),
    'google' => 
    array (
      'client_id' => '272921548264-ulgt9t470ppue02lr2n6a6n4su1rh42s.apps.googleusercontent.com',
      'client_secret' => 'UzgdYC2-aeD__wUnaFP4hntz',
      'redirect' => 'https://climb.mihainside.org',
      'api_key' => NULL,
    ),
  ),
  'session' => 
  array (
    'driver' => 'file',
    'lifetime' => '120',
    'expire_on_close' => false,
    'encrypt' => false,
    'files' => '/opt/www/climb/api/storage/framework/sessions',
    'connection' => NULL,
    'table' => 'sessions',
    'store' => NULL,
    'lottery' => 
    array (
      0 => 2,
      1 => 100,
    ),
    'cookie' => 'climbers_guide_session',
    'path' => '/',
    'domain' => NULL,
    'secure' => NULL,
    'http_only' => true,
    'same_site' => 'lax',
  ),
  'types' => 
  array (
    'areas' => 
    array (
      0 => 'country',
      1 => 'area',
      2 => 'mountain',
      3 => 'peak',
      4 => 'mountain_side',
      5 => 'climbing_site',
      6 => 'crag',
      7 => 'sector',
    ),
    'routes' => 
    array (
      0 => 'multipitch',
      1 => 'singlepitch',
      2 => 'waterfall',
      3 => 'boulder',
    ),
    'grades' => 
    array (
      'fr' => 
      array (
        0 => '-',
        1 => '1',
        2 => '1',
        3 => '1',
        4 => '2',
        5 => '2',
        6 => '3',
        7 => '3',
        8 => '4a',
        9 => '4a/a+',
        10 => '4a+',
        11 => '4a+/b',
        12 => '4b',
        13 => '4b/b+',
        14 => '4b+',
        15 => '4b+/c',
        16 => '4c',
        17 => '4c/c+',
        18 => '4c+',
        19 => '4c+/5a',
        20 => '5a',
        21 => '5a/a+',
        22 => '5a+',
        23 => '5a+/b',
        24 => '5b',
        25 => '5b/b+',
        26 => '5b+',
        27 => '5b+/c',
        28 => '5c',
        29 => '5c/c+',
        30 => '5c+',
        31 => '5c+/6a',
        32 => '6a',
        33 => '6a/a+',
        34 => '6a+',
        35 => '6a+/b',
        36 => '6b',
        37 => '6b/b+',
        38 => '6b+',
        39 => '6b+/c',
        40 => '6c',
        41 => '6c/c+',
        42 => '6c+',
        43 => '6c+/7a',
        44 => '7a',
        45 => '7a/a+',
        46 => '7a+',
        47 => '7a+/b',
        48 => '7b',
        49 => '7b/b+',
        50 => '7b+',
        51 => '7b+/c',
        52 => '7c',
        53 => '7c/c+',
        54 => '7c+',
        55 => '7c+/8a',
        56 => '8a',
        57 => '8a/a+',
        58 => '8a+',
        59 => '8a+/b',
        60 => '8b',
        61 => '8b/b+',
        62 => '8b+',
        63 => '8b+/c',
        64 => '8c',
        65 => '8c/c+',
        66 => '8c+',
        67 => '8c+/9a',
        68 => '9a',
        69 => '9a/a+',
        70 => '9a+',
        71 => '9a+/b',
        72 => '9b',
      ),
      'uiaa' => 
      array (
        0 => '-',
        1 => 'I',
        2 => 'I-II',
        3 => 'II',
        4 => 'II-III',
        5 => 'III',
        6 => 'III-IV',
        7 => 'IV-',
        8 => 'IV',
        9 => 'IV+',
        10 => 'IV+',
        11 => 'IV-V',
        12 => 'IV-V',
        13 => 'V-',
        14 => 'V-',
        15 => 'V',
        16 => 'V',
        17 => 'V',
        18 => 'V+',
        19 => 'V+',
        20 => 'V+',
        21 => 'V-VI',
        22 => 'VI-',
        23 => 'VI-',
        24 => 'VI-',
        25 => 'VI',
        26 => 'VI',
        27 => 'VI',
        28 => 'VI',
        29 => 'VI+',
        30 => 'VI+',
        31 => 'VI+',
        32 => 'VI-VII',
        33 => 'VII-',
        34 => 'VII-',
        35 => 'VII-',
        36 => 'VII',
        37 => 'VII',
        38 => 'VII+',
        39 => 'VII+',
        40 => 'VII-VIII',
        41 => 'VIII-',
        42 => 'VIII-',
        43 => 'VIII',
        44 => 'VIII',
        45 => 'VIII',
        46 => 'VIII+',
        47 => 'VIII+',
        48 => 'VIII-IX',
        49 => 'IX-',
        50 => 'IX-',
        51 => 'IX--IX',
        52 => 'IX',
        53 => 'IX',
        54 => 'IX+',
        55 => 'IX+',
        56 => 'IX-X',
        57 => 'X-',
        58 => 'X-',
        59 => 'X--X',
        60 => 'X',
        61 => 'X',
        62 => 'X-X+',
        63 => 'X+',
        64 => 'X-XI',
        65 => 'XI-',
        66 => 'XI--XI',
        67 => 'XI',
        68 => 'XI-XI+',
        69 => 'XI+',
        70 => 'XI+',
        71 => 'XI-XII',
        72 => 'XII-',
      ),
      'ydr' => 
      array (
        0 => '-',
        1 => '5.1',
        2 => '5.1',
        3 => '5.2',
        4 => '5.3',
        5 => '5.3',
        6 => '5.4',
        7 => '5.4',
        8 => '5.5',
        9 => '5.5',
        10 => '5.6',
        11 => '5.6',
        12 => '5.6',
        13 => '5.6',
        14 => '5.6',
        15 => '5.7',
        16 => '5.7',
        17 => '5.7',
        18 => '5.7',
        19 => '5.8',
        20 => '5.8',
        21 => '5.8',
        22 => '5.8',
        23 => '5.9',
        24 => '5.9',
        25 => '5.9',
        26 => '5.10a',
        27 => '5.10a',
        28 => '5.10a',
        29 => '5.10a',
        30 => '5.10b',
        31 => '5.10b',
        32 => '5.10b',
        33 => '5.10b',
        34 => '5.10c',
        35 => '5.10c',
        36 => '5.10d',
        37 => '5.10d',
        38 => '5.11a',
        39 => '5.11a',
        40 => '5.11b',
        41 => '5.11c',
        42 => '5.11c',
        43 => '5.11d',
        44 => '5.11d',
        45 => '5.12a',
        46 => '5.12a',
        47 => '5.12b',
        48 => '5.12b',
        49 => '5.12c',
        50 => '5.12c',
        51 => '5.12d',
        52 => '5.12d',
        53 => '5.13a',
        54 => '5.13a',
        55 => '5.13b',
        56 => '5.13b',
        57 => '5.13c',
        58 => '5.13c',
        59 => '5.13d',
        60 => '5.13d',
        61 => '5.14a',
        62 => '5.14a',
        63 => '5.14b',
        64 => '5.14b',
        65 => '5.14c',
        66 => '5.14c',
        67 => '5.14d',
        68 => '5.14d',
        69 => '5.15a',
        70 => '5.15a',
        71 => '5.15b',
        72 => '5.15b',
      ),
      'tehnical' => 
      array (
        0 => '-',
        1 => 'A0',
        2 => 'A1',
        3 => 'A2',
        4 => 'A3',
        5 => 'A4',
        6 => 'A5',
      ),
      'incline' => 
      array (
        0 => '-',
        1 => '10',
        2 => '15',
        3 => '20',
        4 => '25',
        5 => '30',
        6 => '35',
        7 => '40',
        8 => '45',
        9 => '50',
        10 => '55',
        11 => '60',
        12 => '65',
        13 => '70',
        14 => '75',
        15 => '80',
        16 => '85',
        17 => '90',
      ),
      'ice' => 
      array (
        0 => '-',
        1 => 'WI1',
        2 => 'WI2',
        3 => 'WI3',
        4 => 'WI3+',
        5 => 'WI4-',
        6 => 'WI4',
        7 => 'WI4+',
        8 => 'WI5-',
        9 => 'WI5',
        10 => 'WI5+',
        11 => 'WI6-',
        12 => 'WI6',
        13 => 'WI6+',
        14 => 'WI7-',
        15 => 'WI7',
        16 => 'WI7+',
        17 => 'WI8-',
        18 => 'WI8',
        19 => 'WI8+',
      ),
      'alpine' => 
      array (
        0 => '-',
        1 => 'AI1',
        2 => 'AI2',
        3 => 'AI3',
        4 => 'AI3+',
        5 => 'AI4-',
        6 => 'AI4',
        7 => 'AI4+',
        8 => 'AI5-',
        9 => 'AI5',
        10 => 'AI5+',
        11 => 'AI6-',
        12 => 'AI6',
        13 => 'AI6+',
        14 => 'AI7-',
        15 => 'AI7',
        16 => 'AI7+',
        17 => 'AI8-',
        18 => 'AI8',
        19 => 'AI8+',
      ),
      'mix' => 
      array (
        0 => '-',
        1 => 'M1',
        2 => 'M2',
        3 => 'M3',
        4 => 'M4',
        5 => 'M5-',
        6 => 'M5',
        7 => 'M5+',
        8 => 'M6-',
        9 => 'M6',
        10 => 'M6+',
        11 => 'M7-',
        12 => 'M7',
        13 => 'M7+',
        14 => 'M8-',
        15 => 'M8',
        16 => 'M8+',
        17 => 'M9-',
        18 => 'M9',
        19 => 'M9+',
        20 => 'M10-',
        21 => 'M10',
        22 => 'M10+',
        23 => 'M11-',
        24 => 'M11',
        25 => 'M11+',
        26 => 'M12-',
        27 => 'M12',
        28 => 'M12+',
        29 => 'M13-',
        30 => 'M13',
        31 => 'M13+',
      ),
      'fr_combined' => 
      array (
        0 => '-',
        1 => 'F-',
        2 => 'F-',
        3 => 'F',
        4 => 'F+',
        5 => 'PD-',
        6 => 'PD',
        7 => 'PD+',
        8 => 'AD-',
        9 => 'AD',
        10 => 'AD+',
        11 => 'D-',
        12 => 'D',
        13 => 'D+',
        14 => 'TD-',
        15 => 'TD',
        16 => 'TD+',
        17 => 'ED-',
        18 => 'ED',
        19 => 'ED+',
        20 => 'ABO-',
        21 => 'ABO',
        22 => 'ABO+',
      ),
    ),
    'climbing' => 
    array (
      'combined' => 
      array (
        0 => 'fr_combined',
        1 => 'uiaa',
      ),
      'mix' => 
      array (
        0 => 'mix',
      ),
      'alpine' => 
      array (
        0 => 'alpine',
      ),
      'tehnical' => 
      array (
        0 => 'tehnical',
      ),
      'required' => 
      array (
        0 => 'fr',
        1 => 'uiaa',
        2 => 'ydr',
      ),
      'ice' => 
      array (
        0 => 'ice',
      ),
      'incline' => 
      array (
        0 => 'incline',
      ),
      'avg_incline' => 
      array (
        0 => 'incline',
      ),
      'rng_from_incline' => 
      array (
        0 => 'incline',
      ),
      'rng_to_incline' => 
      array (
        0 => 'incline',
      ),
      'max' => 
      array (
        0 => 'fr',
        1 => 'uiaa',
        2 => 'ydr',
      ),
      'avg' => 
      array (
        0 => 'fr',
        1 => 'uiaa',
        2 => 'ydr',
      ),
    ),
  ),
  'view' => 
  array (
    'paths' => 
    array (
      0 => '/opt/www/climb/api/resources/views',
    ),
    'compiled' => '/opt/www/climb/api/storage/framework/views',
  ),
  'flare' => 
  array (
    'key' => NULL,
    'reporting' => 
    array (
      'anonymize_ips' => true,
      'collect_git_information' => false,
      'report_queries' => true,
      'maximum_number_of_collected_queries' => 200,
      'report_query_bindings' => true,
      'report_view_data' => true,
      'grouping_type' => NULL,
    ),
    'send_logs_as_events' => true,
  ),
  'ignition' => 
  array (
    'editor' => 'phpstorm',
    'theme' => 'light',
    'enable_share_button' => true,
    'register_commands' => false,
    'ignored_solution_providers' => 
    array (
      0 => 'Facade\\Ignition\\SolutionProviders\\MissingPackageSolutionProvider',
    ),
    'enable_runnable_solutions' => NULL,
    'remote_sites_path' => '',
    'local_sites_path' => '',
    'housekeeping_endpoint_prefix' => '_ignition',
  ),
  'cors' => 
  array (
    'paths' => 
    array (
    ),
    'allowed_methods' => 
    array (
      0 => '*',
    ),
    'allowed_origins' => 
    array (
      0 => '*',
    ),
    'allowed_origins_patterns' => 
    array (
    ),
    'allowed_headers' => 
    array (
      0 => '*',
    ),
    'exposed_headers' => 
    array (
    ),
    'max_age' => 0,
    'supports_credentials' => false,
  ),
  'image' => 
  array (
    'driver' => 'gd',
  ),
  'trustedproxy' => 
  array (
    'proxies' => NULL,
    'headers' => 30,
  ),
  'imagecache' => 
  array (
    'route' => NULL,
    'paths' => 
    array (
      0 => '/opt/www/climb/api/public/upload',
      1 => '/opt/www/climb/api/public/images',
    ),
    'templates' => 
    array (
      'small' => 'Intervention\\Image\\Templates\\Small',
      'medium' => 'Intervention\\Image\\Templates\\Medium',
      'large' => 'Intervention\\Image\\Templates\\Large',
    ),
    'lifetime' => 43200,
  ),
  'activitylog' => 
  array (
    'enabled' => true,
    'delete_records_older_than_days' => 365,
    'default_log_name' => 'default',
    'default_auth_driver' => NULL,
    'subject_returns_soft_deleted_models' => false,
    'activity_model' => 'Spatie\\Activitylog\\Models\\Activity',
    'table_name' => 'activity_log',
    'database_connection' => NULL,
  ),
  'tinker' => 
  array (
    'commands' => 
    array (
    ),
    'alias' => 
    array (
    ),
    'dont_alias' => 
    array (
      0 => 'App\\Nova',
    ),
  ),
);
