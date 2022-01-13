# GerryManderinator

[Requirements](#requirements)

[How to run](#run)

![Home Screen](/demo/home.png)

## Examples

![Election Filter](/demo/elections.png)
![Population Filter](/demo/populations.png)
![District Summary](/demo/districtSummary.png)
![Candidate Summary](/demo/candidateSummary.png)
![Candidate Selection](/demo/candidateSelection.png)
![Algorithm Progress](/demo/algorithm.png)
![Export To GeoJson](/demo/export.png)

## Requirements<a name="requirements"></a>
- Java 16+ (may need to increase JVM ram)

## How to run<a name="setup"></a>

### Setup
- Clone this repository
- Download the Census block information from: http://conorbrandon.com/gerryData.zip
    - unzip
    - the files are too large for Github!
- Place each of the 3 `.json` files from each directory in their respective directory in `Spring/src/main/resources/db-load/{state}/` (where state is AZ, GA, or NV)
    - example: `Spring/src/main/resources/db-load/AZ/censusBlocks.json`
- Modify `Spring/src/main/resources/application.properties` and `Spring/bin/src/main/resources/application.properties` with a MySQL server username, password, and url
    - you will have to create a new schema, in the example the schema is `Gerry`
    - {url}: example: `localhost:3306/Gerry`
    - {username}: example: `root`
    - {password}: example: `GerryManderinator`
- To populate the database tables, uncomment line 99 in `Spring/src/main/java/hornets/app/DatabaseLoader.java`
- __CRITICAL__: after the first time running the 'Starting the server' commands, comment this line again so the database is not recreated!
- Open 2 terminal windows at the `Spring` folder
- Install mapshaper globally with `npm install -g mapshaper`
- Clean the directory with: `./mvnw clean`
- Install the packages with: `npm install`

### Starting the server
- Run the webpack with: `npm run-script watch`
- To start the server type in the second terminal window: `./mvnw spring-boot:run`
    - If you want to up the JVM ram (to 8gb) just for this run, instead type: `./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xms4096m -Xmx8192m"`
    - this is necessary for Georgia. There's a lot of census blocks!
- Finally open a web browser and go to http://localhost:8080/#