# Strapi plugin strapi-backup-plugin
'Strapi Backup Plugin' empowers users to create comprehensive backups of their strapi websites, which can be stored in the local machine drive and restored on any blank strapi project.

***WARNING : ***
This plugin will override the existing data of your project on restoring a backup file.
But the existing 'Data models' and 'Plugins' will remain intact.

# How to create a backup file?
Install the plugin in your strapi project you want to take backup of. The backup file will be created in '.zip' file format. Go to its default page. You will have the option if you want to give backup file a specfic name. Leaving the text box empty will create the backup file with default name e.g. export-1716359828354.zip.

# How to download the backup file?
The created backup file will be listed in table with some meta information. Clicking the download icon will download the corresponding backup file to the browser's 'download' directory. 

# How to restore the backup file?
Users will need to choose the backup file from the browser's 'download' directory, then click 'Restore' button to start the process.
