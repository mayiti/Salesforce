public class AccountHandler {
    public static void PreventDeletion(List<Account> oldacc){
        if(!oldacc.IsEmpty()){
            for(Account a: oldacc){
                if(a.AnnualRevenue > 1000000){
                    a.adderror('You cannot delete accounts with annual revenue over $1M.');
                }
            }
        }
    }
    
    public static void CreateRelatedOpportunity(List<Account> newacc){
        /*Id AccId;
List<Opportunity> OppList = new List<Opportunity>();
if(newacc!= null){
for(Account acc: newacc){
AccId = acc.Id;
}
}
if(AccId != null){
Opportunity o = new Opportunity();
o.AccountId = AccId;
o.Name = 'New related Opportunity from Account';
o.StageName = 'Prospecting';
o.Amount = 5000;
o.CloseDate = Date.today().addMonths(1);
OppList.add(o);
}
if(!OppList.IsEmpty()){
insert Opplist;
}
}*/
        List<Opportunity> Oplist = new List<Opportunity>();
        if(newacc !=null){
            for(Account a : newacc){
                Opportunity o = new Opportunity();
                o.AccountId = a.Id;
                o.Name = 'New related Opportunity from Account';
                o.StageName = 'Prospecting';
                o.CloseDate = Date.Today().addMonths(1);
                o.Amount = 7000;
                Oplist.add(o);
            }
            if(!Oplist.IsEmpty()){
                insert Oplist;
            }
        }
    }
    
    public static void UpdateParentAccountIndustry(List<Account> newacc, Map<Id,Account> mapofacc){
        List<Account> acclist = new List<Account>();
        Id AccId;
        //String childInd;
        Map<Id,String> mapofInd = new Map<Id,String>();
        if(newacc != null){
            for(Account a: newacc){
                if(a.ParentId!= null && (a.Industry != mapofacc.get(a.Id).Industry)){
                    AccId = a.ParentId;
                    //childInd = a.Industry;
                    mapofInd.put(a.ParentId,a.Industry);
                }
            }
        }
        if(mapofInd != null){
            List<Account> acc = [Select Id, Industry from Account where Id =: mapofInd.keyset()];
            for(Account a: acc){
                a.Industry = mapofInd.get(AccId);
                acclist.add(a);
            }
        }
        if(!acclist.IsEmpty()){
            update acclist;
        }
    }
    /*Set<Id> parentAccountIds = new Set<Id>();

for (Account acc : newacc) {
if (acc.ParentId != null) {
parentAccountIds.add(acc.ParentId);
}
}

Map<Id,Account> parentAccounts = new Map<Id,Account>(
[SELECT Id, Industry FROM Account WHERE Id IN :parentAccountIds]
);

List<Account> accountsToUpdate = new List<Account>();

for (Account acc : newacc) {
if (acc.ParentId != null && parentAccounts.containsKey(acc.ParentId)) {
Account parent = parentAccounts.get(acc.ParentId);
parent.Industry = acc.Industry;
accountsToUpdate.add(parent);
}
}

if (!accountsToUpdate.isEmpty()) {
update accountsToUpdate;
}
}*/
    
    public static void CreateNotewhenAccountUpdated(List<Account> newacc){
        List<Note> notlist = new List<Note>();
        if(!newacc.IsEmpty()){
            for(Account a: newacc){
                Note n = new Note();
                n.ParentId = a.Id;
                n.Title = a.Name + ' Updated';
                n.Body = 'An Account ' + a.Name + ' has been udpated';
                notlist.add(n);
            }
        }
        if(!notlist.IsEmpty()){
            insert notlist;
        }
    }
    
    public static void UpdateRelatedContactAddress(List<Account> newAcc, Map<Id,Account> oldmapAcc){
        Map<Id,Account> AccAddress = new Map<Id,Account>();
        List<Contact> conlist = new List<Contact>();
        if(!newAcc.IsEmpty()){
            for(Account a: newAcc){
                if(a.BillingStreet != oldmapAcc.get(a.Id).BillingStreet || 
                   a.BillingCity != oldmapAcc.get(a.Id).BillingCity || 
                   a.BillingCountry != oldmapAcc.get(a.Id).BillingCountry || 
                   a.BillingPostalCode != oldmapAcc.get(a.Id).BillingPostalCode || 
                   a.BillingState != oldmapAcc.get(a.Id).BillingState){
                       AccAddress.put(a.Id,a);
                   }
            }
        }
        List<Contact> Contactlst = [Select AccountId,MailingStreet, MailingCity, MailingCountry, MailingState, MailingPostalCode from Contact where AccountId IN: AccAddress.keyset()];
        if(!Contactlst.IsEmpty()){
            for(Contact c: Contactlst){
                c.MailingStreet = AccAddress.get(c.AccountId).BillingStreet;
                c.MailingCity = AccAddress.get(c.AccountId).BillingCity;
                c.MailingCountry = AccAddress.get(c.AccountId).BillingCountry;
                c.MailingState = AccAddress.get(c.AccountId).BillingState;
                c.MailingPostalCode = AccAddress.get(c.AccountId).BillingPostalCode;
                conlist.add(c);
            }
        }
        if(!conlist.IsEmpty()){
            update conlist;
        }
    }    
    
    public static void ClosedAllOppoCheckbox(List<Account> newacc, Map<Id,Account> mapofoldacc){
        Set<id> Ids = new Set<Id>();
        List<Opportunity> opplist = new List<Opportunity>();
        if(!newacc.IsEmpty()){
            for(Account a : newacc){
                if(a.Close_all_Opps__c == true && a.Close_all_Opps__c != mapofoldacc.get(a.Id).Close_all_Opps__c){
                    Ids.add(a.Id);
                }
            }
        }
        List<Opportunity> lstOpp = [Select AccountId, StageName from Opportunity where AccountId IN: Ids];
        if(!lstOpp.IsEmpty()){
            for(Opportunity o: lstOpp){
                o.StageName = 'Closed Won';
                o.CloseDate = date.today();
                opplist.add(o);
            }
        }
        if(!opplist.IsEmpty()){
            update opplist;
        }
    }
    
    public static void UpdateRelatedOppoStage(List<Account> newacc){
        Set<Id> Ids = new Set<Id>();
        Map<Id,Account> mapofacc = new Map<Id,Account>();
        List<Opportunity> Opplisttoupdate = new List<Opportunity>();
        if(!newacc.IsEmpty()){
            for(Account acc: newacc){
                Ids.add(acc.Id);
            }
        }
        if(!Ids.IsEmpty()){
            List<Opportunity> Opplist = [Select Id, AccountId, StageName,createdDate from Opportunity where AccountId IN: Ids];
            for(Opportunity o: Opplist){
                if(o.CreatedDate < datetime.now().adddays(-30)&& o.StageName != 'Closed Won'){
                    o.StageName = 'Closed Lost';
                    Opplisttoupdate.add(o);
                }
            }
            if(!Opplist.IsEmpty()){
                try{
                    update Opplisttoupdate;
                }catch(Exception ex){
                    system.debug('Error while updating the opportunity '+ex.getmessage());
                }
            }
        }
    }
    
    public static void SendEmailOnAccCreation(List<Account> newacc){
        Set<Id> Ids = new Set<Id>();
        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();
        if(!newacc.IsEmpty()){
            for(Account a: newacc){
                Ids.add(a.id);
            }
        }
        if(!Ids.IsEmpty()){
            User SysAdmin = [Select Email from user where profile.name = 'System Administrator'];
            List<Account> acclist = [Select Name, Id from Account where Id IN: Ids];
            for(Account acc: acclist){
                Messaging.singleEmailMessage mail = new Messaging.singleEmailMessage();
                mail.toAddresses = new String[]{SysAdmin.Email};
                    mail.setSubject('A new Account has been created ' + acc.Name);
                mail.SetPlainTextBody('New Account Created successfully...');
                mails.add(mail);
            }
            if(mails.size()>0){
                Messaging.SendEmailResult[] result = Messaging.SendEmail(mails);
                if(result[0].success){
                    System.debug('Email send successfull to System Admin');
                }
                else{
                    system.debug('Error while sending Email to System Admin '+ result[0].errors[0].message);
                }
            }
            
        }
    }
    
    public static void CreateConOnAccCreationandUpdateAcc(List<Account> newacc){
        Set<Id> Ids = new Set<Id>();
        List<Contact> ContoInsert = new List<Contact>();
        List<Account> AcctoUpdate = new List<Account>();
        Map<Id,Account> mapofAccount = new Map<Id,Account>();
        if(!newacc.IsEmpty()){
            for(Account a: newacc){
                Contact c = new Contact();
                c.AccountId = a.Id;
                c.LastName = a.Name + ' Contact';    
                ContoInsert.add(c);
                Ids.add(a.Id);
            }
        }
        if(!ContoInsert.IsEmpty()){
            try{
                insert ContoInsert;
            }catch(Exception ex){
                system.debug('Error while inserting Contact '+ ex.getmessage());
            }
        }
        if(!Ids.IsEmpty()){
            List<Account> accountList = [Select Id,Client_Contact__c from Account where Id IN: Ids];
            if(accountList.size()>0){
                for(Account acc: accountList){
                    mapofAccount.put(acc.Id,acc);
                }
            }
        }
        if(!ContoInsert.IsEmpty()){
            for(Contact c: ContoInsert){
                if(mapofAccount.containskey(c.AccountId)){
                    //Account acc = mapofAccount.get(c.AccountId); //1st way
                    for(Id a: mapofAccount.keyset()){    //2nd way
                        Account acc = new Account();     //2nd Way
                        acc.Id = a;                      //2nd way
                        acc.Client_Contact__c  = c.Id;
                        AcctoUpdate.add(acc);
                    }
                }
            }
        }
        if(AcctoUpdate.size()>0){
            update AcctoUpdate;
        }
    }
    
    public static void CreateContactBasedOnAccField(List<Account> newacc, Map<Id,Account> mapofAcc){
        Set<Id> Ids = new Set<Id>();
        List<Contact> conlisttoInsert1 = new List<Contact>();
        Map<Id,Integer> mapofInt = new Map<Id,Integer>();
        if(newacc != null){
            for(Account aa: newacc){
                if(aa.NumberOfEmployees != null){
                    mapofInt.put(aa.Id, aa.NumberOfEmployees);
                }
            }
        }
        else if(!mapofAcc.IsEmpty()){
            for(Account aa: mapofAcc.values()){
                if(aa.NumberOfEmployees != null && aa.NumberOfEmployees != mapofAcc.get(aa.Id).NumberOfEmployees){
                    mapofInt.put(aa.Id, aa.NumberOfEmployees);
                }
            }
        }
        if(!mapofInt.IsEmpty()){
            List<Account> acclist = [Select Id, Name, NumberOfEmployees from Account where Id IN: mapofInt.keyset()];
            Integer countContact = [Select Count() from Contact where AccountId IN: mapofInt.keyset()];
            for(Account a: acclist){
                if(countContact < mapofInt.get(a.Id)){
                    Integer contactsToCreateCount = mapofInt.get(a.Id) - countContact;
                    for(integer i=1; i <=contactsToCreateCount; i++){
                        Contact c = new Contact();
                        c.LastName = a.Name + ' '+ i;
                        c.AccountId = a.Id;
                        conlisttoInsert1.add(c);
                    }
                }
                if(!conlisttoInsert1.IsEmpty() && conlisttoInsert1.size()>0){
                    insert conlisttoInsert1;
                }
            }
        }
    }
    
    public static void PreventAccCreationBasedOnName(List<Account> newAcc, Map<Id,Account> mapofAcc){
        Map<id,String> Ids = new Map<Id,String>();
        //system.debug('mapofAcc '+mapofAcc);
        if(newAcc != null && mapofAcc == null){                             // mind blowing
            for(Account a: newAcc){
                if(a.Name != null && !String.IsBlank(a.Name)){
                    Ids.put(a.Id,a.Name);
                }
            }
        }
        else if(newAcc != null && mapofAcc != null){
            for(Account a: newAcc){
                if(a.Name != null && !String.IsBlank(a.Name) && a.Name != mapofAcc.get(a.Id).Name){
                    Ids.put(a.Id,a.Name);
                }
            }
        }
        if(!Ids.IsEmpty()){
            List<Account> acclist = [Select Id,Name from Account where Name IN: Ids.values()];
            if(acclist.size()>0 && !acclist.IsEmpty()){
                for(Account acc: newAcc){
                    acc.Name.adderror('Duplicate Name found');
                }
            }
        }
    }
    
    public static void PreventAccDeletionIfContact(List<Account> oldAcc){
        Set<Id> Ids = new Set<Id>();
       // -------------------   1st way -----------------------------------------
       /* Map<Id,Account> acclist = new Map<Id,Account>();     // ----> 2nd way
        if(!oldAcc.IsEmpty()){
            for(Account acc: oldAcc){
                Ids.add(acc.Id);
                system.debug('Ids '+Ids);
            }
        }
        //Map<Id,Account> acclist = new Map<Id,Account> ([Select Id,(Select Id from Contacts) from Account where Id IN: Ids]);  -->  1st way
        List<Account> acl = [Select Id,(Select Id from Contacts) from Account where Id IN: Ids];  // ----> 2nd way
        for(Account al: acl){    // ----> 2nd way
            acclist.put(al.Id,al);    // ----> 2nd way
        }                              // ----> 2nd way
        system.debug('acclist '+acclist);
        if(acclist.size()>0 && !acclist.IsEmpty()){
            for(Account a: oldAcc){
                if(acclist.get(a.Id).Contacts.size()>0){
                    a.adderror('Account can not be deleted if it contains related Contact');
                }
            }
        }
    }*/
    // ----------------------------  2nd way   --------------------------
        if(!oldAcc.IsEmpty()){
            for(Account acc: oldAcc){
                Ids.add(acc.Id);
            }
        }
        List<Contact> conlist = [Select Id from Contact where AccountId IN: Ids];
        if(conlist.size()>0 && !conlist.IsEmpty()){
            for(Account a: oldAcc){
                a.adderror('Account can not be deleted if it contains related Contact');
            }
        }
    }
}