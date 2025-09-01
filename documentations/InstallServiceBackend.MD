# Deploy backend as a Windows Service.

To run the .exe as a Windows service without requiring Bun.js, use NSSM or WinSW.

## Using NSSM

1. Download NSSM:

    On the Windows machine, download [NSSM](https://nssm.cc/download) from nssm.cc and extract nssm.exe to C:\nssm.


2. Transfer Files:

    Copy my-app.exe and any required files to the Windows machine (e.g., C:\MyApp).


3.  Install the Service:

    * Open Command Prompt as Administrator:

        ```bash
        C:\nssm\win64\nssm.exe install SchemaTransferService
        ```
    * In the NSSM GUI:

        * Path: {folder-directory}/SchemaTransferService.exe
        * Startup directory: {folder-directory}
        * Arguments: Add if needed (e.g., --port 3000)
        * Environment: Add variables (e.g., PORT=3000)
        * Service name: SchemaTransferService

4. Start the Service:

    ```bash
    nssm start MyBunService
    ```

5. Verify:

    * Test the app (e.g., curl http://localhost:3000 for a server) or (http://localhost:3000/swagger for view documentation) .
    * Check NSSM logs or Event Viewer for errors.

## Using WinWS

1. Download WinSW:

    * Download from [GitHub](https://github.com/winsw/winsw/releases) and rename to my-service.exe in {folder-directory}.

2. Create ```my-service.xml```

    ```xml
    <service>
        <id>MyBunService</id>
        <name>My Bun.js Service</name>
        <description>64-bit Bun.js app as a Windows service</description>
        <executable>C:\MyApp\my-app.exe</executable>
        <logmode>rotate</logmode>
        <env name="PORT" value="3000"/>
    </service>
    ```
3. Install and Start:
    ```bash
    C:\MyApp\my-service.exe install
    C:\MyApp\my-service.exe start
    ```

For more info read this on [github](https://github.com/winsw/winsw)