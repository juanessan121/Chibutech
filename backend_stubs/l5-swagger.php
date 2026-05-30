<?php

return [
    'default' => 'default',

    'documentations' => [
        'default' => [
            'api' => [
                'title' => 'Chibutech API',
            ],
            'routes' => [
                'api'           => 'api/documentation',
                'docs'          => 'docs',
                'oauth2_callback' => 'api/oauth2-callback',
                'middleware'    => [
                    'api'  => [],
                    'asset' => [],
                    'docs'  => [],
                    'oauth2_callback' => [],
                ],
                'group_options' => [],
            ],
            'paths' => [
                'docs'          => storage_path('api-docs'),
                'docs_json'     => 'api-docs.json',
                'docs_yaml'     => 'api-docs.yaml',
                'annotations'   => [
                    base_path('app'),
                ],
                'base'          => env('L5_SWAGGER_BASE_PATH', null),
                'excludes'      => [],
                'format_to_use_for_docs' => env('L5_FORMAT_TO_USE_FOR_DOCS', 'json'),
            ],
            'security' => [
                'default_security_scheme' => [
                    'type'        => 'apiKey',
                    'description' => 'Enter token in format: Bearer {token}',
                    'name'        => 'Authorization',
                    'in'          => 'header',
                ],
            ],
        ],
    ],

    'defaults' => [
        'routes' => [
            'docs'      => 'docs',
            'oauth2_callback' => 'api/oauth2-callback',
            'middleware' => [
                'api'  => [],
                'asset' => [],
                'docs'  => [],
            ],
            'group_options' => [],
        ],
        'paths' => [
            'docs'          => storage_path('api-docs'),
            'docs_json'     => 'api-docs.json',
            'docs_yaml'     => 'api-docs.yaml',
            'format_to_use_for_docs' => env('L5_FORMAT_TO_USE_FOR_DOCS', 'json'),
            'annotations'   => [
                base_path('app'),
            ],
        ],
        'scanOptions' => [
            'analyser'    => null,
            'analysis'    => null,
            'processors'  => [],
            'pattern'     => null,
            'exclude'     => null,
            'open_api_spec_version' => env('SWAGGER_VERSION', \L5Swagger\Generator::OPEN_API_DEFAULT_SPEC_VERSION),
        ],
        'securityDefinitions' => [
            'securitySchemes' => [
                'sanctum' => [
                    'type'   => 'http',
                    'scheme' => 'bearer',
                ],
            ],
            'security' => [['sanctum' => []]],
        ],
        'generate_always' => env('L5_SWAGGER_GENERATE_ALWAYS', false),
        'generate_yaml_copy' => env('L5_SWAGGER_GENERATE_YAML_COPY', false),
        'proxy'      => false,
        'additional_config_url' => null,
        'operations_sort'   => env('L5_SWAGGER_OPERATIONS_SORT', null),
        'validator_url'     => null,
        'ui' => [
            'display' => [
                'doc_expansion'     => env('L5_SWAGGER_UI_DOC_EXPANSION', 'none'),
                'filter'            => env('L5_SWAGGER_UI_FILTERS', true),
                'show_extensions'   => env('L5_SWAGGER_UI_SHOW_EXTENSIONS', false),
                'show_common_extensions' => env('L5_SWAGGER_UI_SHOW_COMMON_EXTENSIONS', false),
                'try_it_out_enabled' => env('L5_SWAGGER_UI_TRY_IT_OUT_ENABLED', false),
            ],
            'authorization' => [
                'persist_authorization' => env('L5_SWAGGER_UI_PERSIST_AUTHORIZATION', false),
            ],
        ],
        'constants' => [
            'L5_SWAGGER_CONST_HOST' => env('L5_SWAGGER_CONST_HOST', 'http://localhost:8000'),
        ],
    ],
];
