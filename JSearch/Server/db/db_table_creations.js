module.exports = async function createTablesInPostgresDB(pool) {
  ////////////////////////////////////////////////Table Creation/////////////////////////////////////////////////////////

  //1.  Company table creation
  await pool
    .query(
      `CREATE TABLE IF NOT EXISTS Company (
        CompanyId BIGSERIAL PRIMARY KEY,
        CompanyName VARCHAR(255) NOT NULL UNIQUE,
        Category VARCHAR(255));`
    )
    .catch((err) => console.log("PG ERROR Company Table\n\n\t\t", err.message));

  //2. Job Openings table creation
  await pool
    .query(
      `CREATE TABLE IF NOT EXISTS Job_Openings (
        JobId BIGSERIAL PRIMARY KEY,
        CompanyId BIGSERIAL NOT NULL,
        JobUrl VARCHAR(255) NOT NULL UNIQUE,
        Title VARCHAR(255) NOT NULL,
        Description TEXT,
        DatePostedOn DATE,
        Source VARCHAR(50) NOT NULL,
        Location VARCHAR(100),
        LocationType VARCHAR(50),
        JobType VARCHAR(50),
        RemoteFilter VARCHAR(50),
        ExperienceLevel VARCHAR(50),
        TimeAgo VARCHAR(50)
        );`
    )
    .catch((err) =>
      console.log("PG ERROR Job_Openings Table\n\n\t\t", err.message)
    );

  //3. Leetcode_Interview_Questions table creation
  await pool
    .query(
      `CREATE TABLE IF NOT EXISTS Leetcode_Interview_Questions (
        QId BIGSERIAL PRIMARY KEY,
        CompanyId BIGSERIAL NOT NULL,
        DiscussionLinks VARCHAR(255) NOT NULL,
        Title VARCHAR(255) NOT NULL,
        Difficulty VARCHAR(30),
        Solutions VARCHAR(255),
        Video VARCHAR(255),
        Tag VARCHAR(100)
        );`
    )
    .catch((err) =>
      console.log(
        "PG ERROR Leetcode_Interview_Questions Table\n\n\t\t",
        err.message
      )
    );

  //4. Leetcode_Links table creation
  await pool
    .query(
      `CREATE TABLE IF NOT EXISTS Leetcode_Links (
        LLId BIGSERIAL PRIMARY KEY,
        CompanyId BIGSERIAL NOT NULL,
        Title VARCHAR(255) NOT NULL,
        Discussion_Link VARCHAR(255) NOT NULL UNIQUE,
        Views VARCHAR(10),
        Type VARCHAR(10),
        Upvotes VARCHAR(10),
        Tags VARCHAR(255)
        );`
    )
    .catch((err) =>
      console.log("PG ERROR Leetcode_Links Table\n\n\t\t", err.message)
    );

  //5. Blind_Links table creation
  await pool
    .query(
      `CREATE TABLE IF NOT EXISTS Blind_Links (
        BLId BIGSERIAL PRIMARY KEY,
        CompanyId BIGSERIAL NOT NULL,
        Title VARCHAR(255) NOT NULL,
        Discussion_Link VARCHAR(255) NOT NULL UNIQUE,
        Views VARCHAR(10),
        Type VARCHAR(10),
        Description Text,
        Likes VARCHAR(10),
        Comments VARCHAR(10)
        );`
    )
    .catch((err) =>
      console.log("PG ERROR Blind_Links Table\n\n\t\t", err.message)
    );

  ////////////////////////////////////// Foreign key Constraints Add//////////////////////////////////////////////////////

  // Company Job_Openings Table Creator is User
  await pool
    .query(
      "DO $$ \
    BEGIN \
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_job_openings_company') THEN \
            ALTER TABLE Job_Openings \
                ADD CONSTRAINT fk_job_openings_company \
                FOREIGN KEY (CompanyId) REFERENCES Company(CompanyId) \
                ON DELETE CASCADE; \
        END IF; \
    END; \
    $$;"
    )
    .catch((err) =>
      console.error("fk ERROR Job_Openings Table\n\n\t\t", err.message)
    );

  // Company Leetcode_Interview_Questions Table Creator is User
  await pool
    .query(
      "DO $$ \
      BEGIN \
          IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_leetcode_interview_questions_company') THEN \
              ALTER TABLE Leetcode_Interview_Questions \
                  ADD CONSTRAINT fk_leetcode_interview_questions_company \
                  FOREIGN KEY (CompanyId) REFERENCES Company(CompanyId) \
                  ON DELETE CASCADE; \
          END IF; \
      END; \
      $$;"
    )
    .catch((err) =>
      console.error(
        "fk ERROR Leetcode_Interview_Questions Table\n\n\t\t",
        err.message
      )
    );

  // Company Leetcode_Links Table Creator is User
  await pool
    .query(
      "DO $$ \
        BEGIN \
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_leetcode_links_company') THEN \
                ALTER TABLE Leetcode_Links \
                    ADD CONSTRAINT fk_leetcode_links_company \
                    FOREIGN KEY (CompanyId) REFERENCES Company(CompanyId) \
                    ON DELETE CASCADE; \
            END IF; \
        END; \
        $$;"
    )
    .catch((err) =>
      console.error("fk ERROR Leetcode_Links Table\n\n\t\t", err.message)
    );

  // Company Blind_Links Table Creator is User
  await pool
    .query(
      "DO $$ \
          BEGIN \
              IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_blind_links_company') THEN \
                  ALTER TABLE Blind_Links \
                      ADD CONSTRAINT fk_blind_links_company \
                      FOREIGN KEY (CompanyId) REFERENCES Company(CompanyId) \
                      ON DELETE CASCADE; \
              END IF; \
          END; \
          $$;"
    )
    .catch((err) =>
      console.error("fk ERROR Blind_Links Table\n\n\t\t", err.message)
    );
};
