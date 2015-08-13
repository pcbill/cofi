package com.wistron.mdm.security;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;

import com.wistron.mdm.domain.Admin;
import com.wistron.mdm.domain.AdminDao;
import com.wistron.mdm.domain.UserRegister;
import com.wistron.mdm.domain.UserRegisterDao;
import com.wistron.mdm.domain.enums.UserRoleType;

@Configuration
@EnableWebSecurity
@EnableResourceServer
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {
	private static final Logger log = LoggerFactory.getLogger(WebSecurityConfiguration.class);
	
	@Autowired
	private UserRegisterDao userDao;

	@Autowired
	private AdminDao adminDao;
	
	@Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
    	auth.userDetailsService(userDetailService());
    	
    	// TODO using autheticationProvider in the future
//    	auth.authenticationProvider(casAuthenticationProvider());
    }
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
//    	http.authorizeRequests()
//    		.antMatchers("/index.html").hasRole("ADMIN")
//    		.antMatchers("/**").hasRole("USER")
//    		.antMatchers("/users/**").permitAll()
//	    	.requestMatchers()
//    	.and()
//			.anyRequest().authenticated()
//    	.anyRequest().hasRole("ADMIN")
//        .and()
//        	.csrf().disable()
//        ;
    }
    
    // for test
    @Override
    public void configure(WebSecurity web) throws Exception {
    	web.ignoring().antMatchers(
    		// TODO should be removed list start ----

//    		"/device.html", // for testing
//    		"/react-bootstrap.min.js",
//            "/jsx/components.js",
//            "/policies",
//            "/devices/checkinInfos",
//            "/c",

//            "/devices",
//    		"/users",
//    		"/js/react-bootstrap.min.js",
    		//should be removed list end ----
    			
    		// have to ignore start --------	
			"/index.html",
        	"/js/**",
        	"/users/login/api",
    		"/ios/checkin",
    		"/ios/server",
    		"/contact",
    		"/favicon.ico",

    		"/wks/register", // for WKS, normal edition have to be removed it.
    		"/checkProfile/api", // for WKS, normal edition have to be removed it.
    		// have to ignore end --------	
    		
    		"/ios/enroll",
    		"/ios/appDownload",
    		"/ios/plistDownload",
    		"/page/ios/enroll",
    		"/page/ios/enrollsuccess",
    		"/page/ios/downloadApp",
    		"/ios/devicestatusmonitor"
    	);
    }
    
    @Bean
	UserDetailsService userDetailService() {
    	return new UserDetailsService() {
			@Override
			public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
				Admin admin = adminDao.findOne(username);
				UserRegister account = userDao.findOne(username);
				if (admin == null && account == null) {
					throw new UsernameNotFoundException(username);
				}
				
				if (account != null) {
					return new User(account.getUserId(), 
							account.getPassword(), 
							true, 
							true, 
							true, 
							true, 
							AuthorityUtils.createAuthorityList(account.getRole())); 
				}
				
				if (admin != null) {
					return new User(admin.getUserId(), 
							admin.getPassword(), 
							true, 
							true, 
							true, 
							true, 
							AuthorityUtils.createAuthorityList(UserRoleType.ADMIN.name())); 
				}
				
				throw new UsernameNotFoundException(username);
				
			}
		};
	}
}