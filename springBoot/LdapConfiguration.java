package com.wistron.mdm;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;

@Configuration
public class LdapConfiguration {
//	private static final Logger log = LoggerFactory.getLogger(LdapConfiguration.class);
	
	@Autowired
    Environment env;
	
	@Bean
    public LdapContextSource contextSource () {
		if ("true".equals(env.getRequiredProperty("ldap.authentication"))) {
			String url = env.getRequiredProperty("ldap.url");
			String base = env.getRequiredProperty("ldap.base");
			String userDN = env.getRequiredProperty("ldap.userDN");
			String password = env.getRequiredProperty("ldap.password");
	
			LdapContextSource contextSource= new LdapContextSource();
			contextSource.setUrl(url);
			contextSource.setBase(base);
			contextSource.setUserDn(userDN);
			contextSource.setPassword(password);
	        return contextSource;
		} 
		return null;
    }

    @Bean
    public LdapTemplate ldapTemplate() {
    	if ("true".equals(env.getRequiredProperty("ldap.authentication"))) {
    		return new LdapTemplate(contextSource());
    	} 
    	return null;
    }
	
}
