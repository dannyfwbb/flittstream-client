
export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}

export interface AccessToken {
    nbf: number;
    exp: number;
    iss: string;
    aud: string | string[];
    client_id: string;
    sub: string;
    auth_time: number;
    idp: string;
    scope: string | string[];
    amr: string[];
}
