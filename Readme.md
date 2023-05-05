Just todo here

expected output

- dist/types -> types will be compiled to docs as seperate MD file

- auth
  i dont think i will ever make this, but just in case i would make a ban-ip temp for someone who spam api more than 30 req/s
  
- Files(endpoints) -> will have -> usage with npm
                                -> usage with api and its body that needed
                                -> body example
                                -> output example
                                -> exports an express router



Structure ->
            src -> app - index as main router and / (which actually just return 200 and api ready)
                       - util -
                              - test.ts
                              - endpoints & types
                       - endpoints - 
                                   - **.ts
            (should be monorepo(hopefully))
            packages -> ** -> src -
                                  - util -
                                         - handler
                                         - endpoints (to actually get endpoint from api)
                                  - lib - types gatherer
                                        - interface


endpoints exporting docs
// body : boolean (determining does an endpoint need a body or not)
// bodyObject : {[x]:[y]} (Object that will be parsed to body if `body` true)
// EOL (endOfLine must be emmited on every docs)