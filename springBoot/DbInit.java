package com.wistron.mdm;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.wistron.mdm.domain.Admin;
import com.wistron.mdm.domain.AdminDao;
import com.wistron.mdm.domain.ContactPerson;
import com.wistron.mdm.domain.ContactPersonDao;
import com.wistron.mdm.domain.UserRegister;
import com.wistron.mdm.domain.UserRegisterDao;
import com.wistron.mdm.wks.domain.ProfileQueryDao;

@Component
public class DbInit {

	@Autowired
	private ContactPersonDao contactPersonDao;
	
	@Autowired
	private UserRegisterDao userDao;

	@Autowired
	private AdminDao adminDao;

	@Autowired
	private ProfileQueryDao profileQueryDao;
	
//	@Autowired
//	private OperationHistoryDao operationHistoryDao;
	
	@PostConstruct
	public void init() {

		initAdmin();
		
		initContacts();
		
		initTestData();
	}

	private String MMdd() {
		SimpleDateFormat sdf = new SimpleDateFormat("MMdd");
		return sdf.format(new Date());
	}
	
	private void initAdmin() {
		Admin entity = new Admin("admin", "admin"+MMdd());
		adminDao.save(entity);
	}
	
	private void initContacts() {
		
		ContactPerson entity = new ContactPerson();
		entity.setId("1");
		entity.setName("Wings");
		entity.setEmail("wings_pu@wistron.com");
		entity.setTelephone("8568+6656");
		contactPersonDao.save(entity);
		
		ContactPerson entity1 = new ContactPerson();
		entity1.setId("2");
		entity1.setName("Tim");
		entity1.setEmail("tim_li@wistron.com");
		entity1.setTelephone("8518+211");
		contactPersonDao.save(entity1);
	}
	
	// TODO just for testing, it should be removed someday
	 @Deprecated
	private void initTestData() {
		userDao.save(new UserRegister("test", "testpassword"));
		userDao.save(new UserRegister("wistron", "123456"));

//		OperationHistory entity = new OperationHistory();
//		entity.setUserId("userId");
//		entity.setOperation("operation");
//		entity.setContent("content");
//		operationHistoryDao.save(entity);
//
//		OperationHistory entity1 = new OperationHistory();
//		entity1.setUserId("userId1");
//		entity1.setOperation("operation1");
//		entity1.setContent("content1");
//		operationHistoryDao.save(entity1);
		
//		ProfileQuery entry = new ProfileQuery();
//		entry.setCommandUUID("command1");
//		entry.setPayloadContent("good payload");
//		profileQueryDao.save(entry);
//		
//		ProfileQuery entry1 = new ProfileQuery();
//		entry1.setCommandUUID("command11");
//		entry1.setPayloadContent("good payload1");
//		profileQueryDao.save(entry1);
		
	}
}
