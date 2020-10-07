
![title](https://i.imgur.com/DsKfxsn.png)
---
First of all, **Kafuu-Viewer** was developed according to my own needs. The purpose is to study **PHP**.  It can display some images or comics. UI design based on **Bootstrap** framework, also reference some design of comic websites. It also include the responsive web design for mobile.

*Mainly supported browsers: **MS edge**, **chrome***

![proj show](https://i.imgur.com/wxK5IZ5.png)

## TABLE OF CONTENTS
* **Requirements**
* **Introduction**
  * **Technology**
  * **Features**
  
## Requirements
1. Add, delete, modify files and view these data:
    * File upload in different situations, such as **folder** upload or **ZIP** upload.
    * Generate a file named "**delete log.txt**" to record the details when the file is deleted, and then move the deleted file to a folder named "**Recycle Bin**". (No need to actually delete the files)
    
2. The responsive web design for mobile

3. You can search for related files by name and display

## Introduction
This project mainly uses a local server to store data. Getting data through PHP and SQL statements. 

The flow chart is as follows:

![flow chart](https://i.imgur.com/3SQy5Wm.png)

### 1. Technology
  |   Tools    |  Language  | Third party                               |
  |:----------:|:----------:|:-----------------------------------------:|
  | WampServer |    HTML    | [Jquery](https://jquery.com/)             |
  |  VS code   | JavaScript | [Bootstrap](https://getbootstrap.com/)    |
  |  Navicat   |    CSS     | [Font Awesome](https://fontawesome.com/)  |
  | Photoshop  |    PHP     |                                           |
  |            |    SQL     |                                           |

###  2. Features
* **Upload file**

  * Upload format selection (Only files in **IMG** format or **ZIP** format can be uploaded. ZIP will decompress and check the backend file, and finally return the result.)
  
    ![upload gif](https://i.imgur.com/EEzjnt2.gif)

  * Backend file processing (All file structures will be converted to the format on the right, empty files will be deleted.)
  
    ![upload png](https://i.imgur.com/zUHy4rz.png)
    
      ****The display of pictures is based on the order of picture names***
  
* **Delete file**
  * If there is a file with the same name in the recycle bin, the old file will be deleted
  ![delete img](https://i.imgur.com/IdzPkJ1.png)
  
* **Modify file**

  ![modify img](https://i.imgur.com/6CsXJLP.png)
  
* **Search and Pagination**
  
  ![search img](https://i.imgur.com/cvXfBCx.gif)
  ![pagination img](https://i.imgur.com/5bpSS5B.gif)
  ***"..." is to select a page***
  
* **Responsive web design**
  ![mobile img](https://i.imgur.com/YlcxG3Z.png)
  
  ***In order to enable the "zoom page" on the phone to zoom in and out of the picture,  so no meta viewport tag added***
