# Software engineering
## GResearch: Jul '21 - NOW
At [GResearch](https://www.gresearch.co.uk/), I've gotten to work with some talented engineers and analysts on the reference data team
to onboard new data sources and ensure quality of daily and historic data.


### Historic reference data renormalization: Q2-Q4 2022 & ongoing
* The reference data team, apart from pricing, maintains about 10^8 datapoints (10^5-10^6 underliers, 10^2-10^3 lifetime, 10^1 attributes)
* We get and store raw data, and then normalize that data into a mssql server (ownership of db is shared between data teams and the dedicated dba team)
* Sometimes, due to data issues / changes, or improvements/changes in data processing, the normalized data can become inconsistent or incomplete with respect to the raw data
* This project aims to fix                            this inconsistency

#### What
* Note - as of now (2022 Q4), the tooling is complete, but productionization has just started
    - We have pushed only 2 feeds so far, in a manual process to ensure correctness.
* I built a kotlin service to trigger renormalizations of raw data to normalised data on a feed-by-feed basis (feed here is ~an exchange) in csv files
* I did work to run an existing Kubernetes service, which usually runs one pod, at scale using armada (https://github.com/G-Research/armada), to run hundreds of jobs at once.
* I built the python etl tool I created (see Cross-team data flow) to watch and injest these files into our database.
* I worked on a team with 2 other reference data engineers - 1 in Q3, who did most of the work in modifying the exisitng kubernetes service to
run in a renorm-mode, and 1 in Q4 who is owning a lot of the work on using the tool in production to safely push out real world data, and to ensure a solid rollback strategy. 
* We're working with two reference data analysts to do checks of data quality on the renorm data.


#### Why
* Historic data is used for simulation of trading strategies
* Slightly biased or future-looking historical data can lead to drastic under performance in live data
* A specific issue with the historic data was noted that will be solved with this renorm work
* General improvements to the historic data will be made with this renorm work.

#### Scale
* low ~hundreds of feeds, with about ~6 attributes per feed which we have historic raw data for.
* This service, if we renormed all of these feeds, deals with about ~30% of all non-pricing reference data


### Cross-team data flow: Q3-Q4 2022
Please ask for more information - I can talk more about the work, but can't be too specific on the specific project.

#### What
* Created the first ever reference data system to automatically flow quant outputs back into the reference data team
    - Used an existing quant tool for the first time in reference data, which involved solving some technical challenges with cross-org communication
* Created a general tool for easy-to-write ETL flows in python
* owned Design, implementation, and productionization
* worked with other engineers (reference, research, aggregate data, and quant tooling), and the new liquidity cross-org project owner as well as several other stakeholders.


#### Why
A certain use case required feeding back quant-computed pricing data as reference data for consumption by other systems in the business.

#### Immediate impact
* Initial use case was met in a timely manner
* Initual use case results are reliable and have automated alerting

#### Ongoing impact
* This ETL tool is also being use for my team's historic reference data renormalization work
* This quant tool is now being scoped for use in validations work, to validate the world more closely to how our consumers see it.

### Automating id changes: Q2 2022
When instruments change ids (changes in cusip, isin, sedol, ric, bloomberg global id), we need to ensure we capture that, 
and ensure a consistent internal mapping to the same instrument over time.


#### What
* Turned a fully manual process (UI-based change applier) into a mostly (95%) automated one - some types of corporate actions are harder to automate
* UI udated the existing kotlin services for the UI to automatically apply the automated changes - no new services were needed.
* Added validations for correctness of the automated changes, using the validation tool I built up previously (see Validations)

#### Why
* More timely id changes - sometimes, a critical change is needed with less than 24hr notice - these can break trading if not applied.
* Saves analyst time

#### Scale
* about 100 id changes per day, down to just a few per day that are not automated.


### Validations: Q4 2021- Q1 2022

#### What
I built a tool to allow monitoring and suppressing of data quality issues. I chose to build this using Dash and Postgresql, 
and was able to create and deploy the system to production use by data analysts within Q4, and enable turndown of the existing legacy tool in early Q1. 

I also took ownership and built up a nacent tool to write data quality checks into this system using SQL & python. 
* This tool is Jupiter notebooks on top of a custom python library that feeds into the above monitoring system and existing alerting & dashboards (Prometheus, graphana, tableau).
* These notebooks are accessible via voila, and run on config customizable cron schedules on kubernetes.
* Over the course of Q4 and Q1, I
    - built in automated SQL integration tests (Record and replay with pytest, using schema reflection to load relevant data, spinning up a dockerized mssql during testing),
    - enabled shared queries over database calls to different servers (using pandas as intermediate storage), and
    - enabled specifying alerting in python (by writing effectively dynamic Prometheus queries).

#### Why
This work has increased our data quality by enabling the effectiveness of data analysis, has had cross-org visibility
and impact into the work other teams are doing, and has led to me working on a similar cross-org tool in 2022 for quants.

#### Immediate impact
By the end of Q4 2021, this tool was used by 6 data analysts, with a rotation of one using it full time. Also in Q4 2021, I presented this tool to my manager's colleagues in the data eng org,
and several managers in the quant org.

#### Ongoing impact: (as of Q4 2022)
* As of now, in Q4 2022, this tool is still in daily use on the Reference Data team. It is used for both BAU and for adding onging new validations.
* It currently runs over 150 different validations
* It has also expanded to be used by the Aggregate & Tick Data team
* I am now working 40% time on creating a similar but different use case tool for one of the quant managers I presented to a year ago, in 2021 Q4.
* I and other people on reference data now add new validations regularly to validate correctness of new pipelines, to enable automated alerting of errors
    - I've used this in my Cross-team data flow tool (see above) as well as my historic renorm work (see above)

#### Scale
* Bulk data - ~ 10^8 datapoints (10^5-10^6 underliers, 10^2-10^3 lifetime, 10^1 attributes)
* Relevant data - 10^7 (subset of underliers and data required for training, backtesting, and trading)
* Data inputs ~ 50-100 sources  (Exchange & 3rd party  feeds, files, APIs)
* Reference Data Validations - 150 validations, written and used by data analysts.\
* Dashboards - ~10 - 6 Aggregate Data dashboards, 1 dashboard for execution, 3 Reference data dashboards (options, new liquidity data quality, BAU data quality)
* Quality of data - 10^5 data points flagged at peak in BAU due to underlying data quality issues. We now usually sit around ~100s of BAU issues, plus ~10^3 issues in spikes of new liquidity.
* Data consumers - the rest of G-Research (100s of quants, engineers, and data analysts), to feed into alphas.
* Validation / dashboard writers: about 14 engineers and 6 analysts lifetime, and 4 engineers + 3 analysts weekly.


## Google Groups: Jul '19 - Jun '21
At Google, I worked on [Google Groups](https://groups.google.com/) in the Apps org.

Most of the implementation work here was done in Java.

Here are some of the projects I worked on:

### Data export
* Owned improvement and maintenance of Google Group's cross-team data export integration
* Owned preparation, communication, and final AI resolution for a major update of features to Google Groups's data export integration
* Led launch and approval process up to the director level for this update
* Submitted 89 reviewed changes and reviewed 32 others related to this work
* Owned and performed mitigation and impact analysis related to several postmortems
* Created automated test specs for full coverage over existing manual testing, implemented those automated tests, and added the tests to an Apps-wide launch approval tracker.

### Internal migration of two APIs
* Completed a complex, time-sensitive, client-transparent migration of multiple Google-external APIs
* Owned complete migration of one API across 86 reviewed changes and 39 tracked tickets.
* Co-owned migration of another api across 46 code changes, 11 config changes, and 17 rollout commits, as well as reviewing  48 other changes.


### Experimental design
* Designed an experimental feature across the stack, engaging both technical and managerial expertise.
* Major co-author to an experimental design with the goal of increasing engagement
* Design included UX, frontend, backend, and storage development.
* Worked with team leads, project managers, UX, legal, and privacy to ensure buy-in on all fronts.

### Direct customer feature work
* Designed a customer-specific feature from the ground up
* Met with the customer, and along with my project manager iterated on potential resolution to their needs.
* Sole owner and designer of new functionality to support their needs, making use of my previous experience with our external APIs, and working across our stack to design an implementation meeting the needs of the feature.
* With assistance from my manager, coordinated buy-in and work commitment on the scale of weeks from three other internal teams.



## Computer science education: Aug '16 - May '19
I graduated with a Bachelor's of Computer Science from Rensselaer Polytechnic Institute in 2019, averaging a 3.8 GPA over the following classes:

Data Structures, Computer Organization, Foundations of Computer Science, Intro to Algorithms, Computer Algorithms, Principles of Software, Database Systems, Intro to Artificial Intelligence, Natural Language Processing, Software Design and Documentation, Machine Learning From Data, Computational Finance, Programming Languages, Operating Systems, Principles of Program Analysis, Game Architecture

## Projects
### Sudoku [Live demo](/sudoku)
A [p5.js](https://p5js.org/) implementation of sudoku

### Mnist [Live demo](/mnist_model)
A [p5.js](https://p5js.org/) supported grid, with an mnist model i trained loaded in javascript in the browser. As you draw, the model will guess the number.

### [Apple worm](https://github.com/CharlesFauman/AppleWorm)
A java implementation of the game apple worm, originally from https://www.coolmathgames.com/0-apple-worm

### [Halite 3 bot](https://github.com/CharlesFauman/halite_3_bot)
Halite 3 was a fun competition, done in 2018. My friend and I each worked on our own bots in python, and then combined our efforts into a java bot. We placed 179 out of 4014 players: https://2018.halite.io/programming-competition-leaderboard?username=CharlesFauman

### [Design for an extended replay viewer for Halite III](https://docs.google.com/document/u/1/export?format=pdf&id=1j63a-fCnzurMa3NbujcBgzFIDt8dkd2y3Pdexbjf9AY)
A fully fleshed out design for adding two new features to [halite III](https://halite.io/)

### [Sudoku solver](https://github.com/CharlesFauman/sudoku-solver)
A sudoku solver written in C++, done by converting the problem into a constraint satisfaction problem and applying a solver.

### [Connect 4 arena](https://github.com/CharlesFauman/Connect_Four)
Created an arena to run tournaments between four bots. My connect four bot can also be found under Programs/Charlie_sourcecode/main.cpp

### [Pong game](https://github.com/CharlesFauman/SFML)
A simple pong game written in C++ using the SFML library


## Values
If I had to list out three words to describe my work ethic, they would be these:
* Inquisitiveness - I ask questions about everything if I am learning something. I will question things that are implied to be obvious if they are not obvious to me. I will play devil's advocate with my own reasoning for the sake of getting in depth on something so that I can learn more.
* Minimalism - I will try to do the least amount of work possible to get something done. I will spend time seeing what I spend a lot of time on, and then find ways to not spend a lot of time on it. I am ok if things don't get done if I don't think that they absolutely need to happen.
* Spontaneity - I will go deep into various interests that change on a weekly basis. I will be interested in doing random things just to try them out.

## Strengths
* Learning, exploring, absorbing, and asking about everything related to whatever I'm working on to get a deeper understanding of how what I'm doing fits in with a broader picture.
* If I have an end goal that I want to reach, I am very good at persevering and getting around blockers as long as I really care about reaching my goal
* I really want to do everything, which is of course impossible. So a skill I've developed is effective reprioritization. In other words, I am quick to adapt my estimation for how much work something will take, and how much value it will create, and reprioritize my goals based on that.


## What I like about software engineering
* Learning new programming languages and paradigms, software architecture, product design, and ingenious solutions to any problem
* Being able to think about a solution and immediately develop and use it
* Exploring and discovering the simplest solutions to problems
* Improving performance of existing solutions
* Thinking about product decisions and prioritization and tradeoffs with the existing implementation in mind
* Having my opinions and ideas respected and thoroughly considered, if not acted upon

## Bonus! Fun programming Youtube channels to watch
### [ArjanCodes](https://www.youtube.com/c/ArjanCodes/featured)
Development in python and python best practices.

### [Computerphile](https://www.youtube.com/channel/UC9-y-6csu5WGm29I7JiwpnA)
Signal processing, data analysis, algorithms, paradigms, and the history of computing.

### [LiveOverflow](https://www.youtube.com/channel/UClcE-kVhqyiHCcjYwcpfj9w)
h4cking explanations and IT security discussions.

### [ThinMatrix](https://www.youtube.com/user/ThinMatrix)
Full Game development vlogs, from the beginning to end of at least two games so far over the course of years.

### [The Cherno](https://www.youtube.com/c/TheChernoProject/featured)
Game Engine development.

### [The Coding Train](https://www.youtube.com/c/TheCodingTrain/featured)
Programming UI using the processing library, mainly using p5.js (the javascript version).
