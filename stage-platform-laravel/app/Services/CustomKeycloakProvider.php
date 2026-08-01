<?php
namespace App\Services;

use SocialiteProviders\Keycloak\Provider as BaseKeycloakProvider;

class CustomKeycloakProvider extends BaseKeycloakProvider
{
    protected function getInternalBaseUrl()
    {
        $internalUrl = config('services.keycloak.internal_base_url');
        return rtrim(rtrim($internalUrl, '/') . '/realms/' . $this->getConfig('realms', 'master'), '/');
    }

    protected function getTokenUrl(): string
    {
        return $this->getInternalBaseUrl() . '/protocol/openid-connect/token';
    }

    protected function getUserByToken($token)
    {
        $response = $this->getHttpClient()->get($this->getInternalBaseUrl() . '/protocol/openid-connect/userinfo', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token,
            ],
        ]);

        return json_decode((string) $response->getBody(), true);
    }
}