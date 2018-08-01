# Contributing

## Pull requests only

**DON'T** push to the master branch directly. Always use feature branches and let people discuss changes in pull requests.
Pull requests should only be merged after all discussions have been concluded and at least 1 reviewer has given their
**approval**.

⚠️ ⚠️ ⚠️ 

We do use [zappr](https://zappr.opensource.zalan.do/) with the following checks enabled:
- **Approval check**
 - The approval feature blocks a pull request until it has the required amount of approvals.
- **Specification check** 
 - The specification check will verify that a pull request's title and body conform to the length and content requirements.
 
 Effective configuration:
 
 ```
 autobranch:
  pattern: '{number}-{title}'
  length: 60
commit:
  message:
    patterns:
      - '#[0-9]+'
approvals:
  minimum: 2
  ignore: none
  pattern: "^(:\\+1:|👍)$"
  veto:
    pattern: "^(:\\-1:|👎)$"
  groups:
    zalando:
      minimum: 2
      from:
        orgs:
          - zalando
specification:
  title:
    minimum-length:
      enabled: true
      length: 8
  body:
    minimum-length:
      enabled: true
      length: 8
    contains-url: true
    contains-issue-number: true
  template:
    differs-from-body: true
pull-request:
  labels:
    additional: true
X-Zalando-Team: torch
X-Zalando-Type: code
```
