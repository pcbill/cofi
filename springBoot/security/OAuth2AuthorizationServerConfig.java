package com.wistron.mdm.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.InMemoryTokenStore;

import com.wistron.mdm.OauthConfig;

@Configuration
@EnableAuthorizationServer
public class OAuth2AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {

	@Autowired
	private OauthConfig oauthConfig;
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Override
	public void configure(AuthorizationServerEndpointsConfigurer endpoints)
			throws Exception {
		DefaultTokenServices tokenServices = new DefaultTokenServices();
		tokenServices.setTokenStore(tokenStore());
		tokenServices.setSupportRefreshToken(true);
		tokenServices.setAccessTokenValiditySeconds(Integer.parseInt(oauthConfig.getAccessTokenValiditySeconds())); 
		tokenServices.setReuseRefreshToken(false); // NO reuse refresh token
		endpoints.tokenServices(tokenServices);
		
		endpoints.tokenStore(tokenStore());
		endpoints.authenticationManager(authenticationManager);
	}

	@Override
	public void configure(ClientDetailsServiceConfigurer clients)
			throws Exception {

		clients.inMemory()
				.withClient(oauthConfig.getClientId())
				.secret(oauthConfig.getSecret())
				.scopes(oauthConfig.getScopesArray())
				;
	}
	
	@Bean
    public TokenStore tokenStore() {
        return new InMemoryTokenStore();
    }
}