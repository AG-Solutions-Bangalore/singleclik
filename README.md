handleUpdate in edit

request header
categories_data [
"id": 1,
"u_catg_id": 21,
`
when u_catg_id is 31 than u_catg_other_category, u_catg_other_sub_category
when u_categ_id is not 31 than send null
`
u_catg_status
]

subcategories_data [
"id": 1,
"u_subcatg_id": 78,
when usubcat_id is 94 than u_subcatg_other_sub_category or when u_subcatg_id has value still send u_subcatg_other_sub_category(null)
u_subcatg_status
]

{
"code": 200,
"profile": {
"id": 1,
"name": "Govind Garg",
"company_name": "AG Solutions",
"mobile": "8867171060",
"email": "agsolutionsag@gmail.com",
"profile_type": "0,1",
"whatsapp": "8867171060",
"website": "www.ag-solutions.in",
"about_us": "We take immense pleasure in introducing our esteemed company \\\"AG Solutions!\\\" TEN YEARS OLD and still rocking! Striving hard towards perfection, providing all types of tech and digital solution to our clients under one roof! We are into web development, desktop applications (stand-alone) and mobile applications.",
"payment": "No",
"validity": "2054-01-30",
"email_verified_at": null,
"area": "Jayanagar",
"photo": "Govind Garg.jpg",
"status": "Active",
"cpassword": "123456",
"token": "123456",
"user_type": 2,
"device_id": "cPLe78z3S4WPfZnvzkBQ0W:APA91bHr6T51UKCon8lFoHIS_4Far3W9xfRwur8-I56viWm8Z0NOCZ9oknf5f1XKbZsu0w3_tH0hoiYaHtTqJHIAOgLLgGTsTf94_h5J6aCBrNZfckqMJpDJyqOn2GApzdIHvFcLAu2I",
"last_login": "2024-10-25",
"remarks": null,
"referral_code": "G8300",
"referred_by_code": null,
"s_whatsapp": "Yes",
"s_email": "Yes",
"s_sms": "Yes",
"s_notification": "Yes",
"created_at": "2024-09-26T10:53:01.000000Z",
"created_by": null,
"updated_at": "2024-10-25T09:19:23.000000Z",
"updated_by": null
},
"categories": [
{
"id": 1,
"u_catg_id": 21,
"category": "IT Company",
"u_catg_other_category": null,
"u_catg_other_sub_category": null,
"u_catg_status": "Active"
},
{
"id": 2,
"u_catg_id": 10,
"category": "Event Planner",
"u_catg_other_category": null,
"u_catg_other_sub_category": null,
"u_catg_status": "Active"
}
],
"subcategories": [
{
"id": 1,
"u_subcatg_id": 78,
"subcategory": "Mobile Apps And Web Developer",
"u_subcatg_other_sub_category": null,
"u_subcatg_status": "Active"
},
{
"id": 2,
"u_subcatg_id": 36,
"subcategory": "Corporate, Wedding, Anniversary",
"u_subcatg_other_sub_category": null,
"u_subcatg_status": "Active"
},
{
"id": 3,
"u_subcatg_id": 79,
"subcategory": "Digital Marketing",
"u_subcatg_other_sub_category": null,
"u_subcatg_status": "Active"
},
{
"id": 4,
"u_subcatg_id": 102,
"subcategory": "Software",
"u_subcatg_other_sub_category": null,
"u_subcatg_status": "Active"
}
]
}
