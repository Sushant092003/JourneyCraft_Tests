# 🌱 JourneyCraft – Database Seed (Dummy Data)

This file contains **dummy data** for testing and development purposes.

Use this to quickly populate the database with sample:

- Users
- Guides
- Restaurants
- Street Locations

---

# ⚠️ Prerequisites

- MySQL is running
- Database `journeycraft_db` already exists
- Backend has been run at least once (tables created by Hibernate)

---

# 🏗️ Step 1: Select Database

```sql
USE journeycraft_db;
```

# 🏗️ Step 2: Insert Dummy data for users

```sql
INSERT INTO users (id, username, email, password, role) VALUES
(1, 'guide_user', 'guide@journeycraft.com', 'password123', 'GUIDE'),
(2, 'restaurant_user', 'restaurant@journeycraft.com', 'password123', 'RESTAURANT');
```

# 🏗️ Step 3: Insert Dummy Guide

```sql
INSERT INTO guide (
  id,user_id,guidename,experience,language,bio,latitude,longitude,license_number,is_available,phone_no,is_approved
) VALUES (
  1,1,'Rohit Sharma',5,'English, Hindi','Experienced local guide with 5+ years of experience in city tours.',18.5204,73.8567,'LIC-GUIDE-12345',true,'9876543210',true
);
```

# 🏗️ Step 4: Insert Dummy Restaurant

```sql
INSERT INTO restaurant (id,user_id,resto_name,rating,location_link,fssai_license,open_time,close_time,description,phone_no,average_cost,food_type,is_approved
) VALUES (
  1,2,'Spice Villa',4.5,'https://maps.google.com/?q=Spice+Villa+Pune','FSSAI-987654321','10:00','22:00','A popular multi-cuisine restaurant in Pune.','9123456789',500,'BOTH',true
);
```

# 🏗️ Step 5: Insert Dummy data Street Locations

```sql
INSERT INTO streetLocations (
  id,name,link,lat,lng
) VALUES
(
  1,'Shivaji Nagar, Pune','https://maps.google.com/?q=Shivaji+Nagar+Pune',18.5308,73.8475
),
(
  2,'Shaniwar Wada, Pune','https://maps.google.com/?q=Shaniwar+Wada',18.5195,73.8553
);
```
