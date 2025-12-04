## 1 Introduction

This task is designed to evaluate your Angular expertise, technical knowledge, and communication skills. It assumes you have hands-on experience with Angular development, TypeScript, RxJS, and component-driven architecture, as well as familiarity with common practices such as state management, modular design, and automated testing.

The challenge below simulates Angular development scenario and is intended to assess both your ability to deliver clean, functional code and how well you can document, structure, and communicate your work.

> [!IMPORTANT]
> All deliverables should be delivered via merge request(s).

## 2 Challenge

Your task is to create calculation game using Angular with the following specification.

### 2.1 Gameplay

* Display a formula with two random integers (e.g., 5 + 4 = _).
* User enters the sum and submits (press Enter or click a button).
* Immediately evaluate and mark the attempt as correct or wrong.
* Generate a new formula after each submission.
* Show a live “history” list below the formula.
* Each "history" entry shows the operand, the user’s answer, and a correct/wrong marker.

### 2.2 Example interaction
```
5 + 4 = _    (user enters 8)     → 5 + 4 = 8  wrong!
5 + 4 = _    (user enters 9)     → 5 + 4 = 9  correct!
7 + 12 = _   (user enters 19)    → 7 + 12 = 19 correct!
```

### 2.3 Store and data
* Use `rx.js` to store and display calculations.

### 2.4 UI
* Use Angular Material for inputs, buttons, and list items (chips or list with icons).
* Provide clear visual feedback for correct vs wrong (icon, color, or chip).
* Include a basic responsive layout.

### 2.5 Testing
* Write unit tests.
* Write e2e tests.

### 2.6 Architecture
* Split code into smaller meaningful components.

### 2.7 Bonus points

* Code quality (organization, structure, readability).
* Usage of design patterns.
* Meaningful code comments.
* Descriptive loging.
* Error handling.
* Usage of docker container.

### 2.8 Deliverables

* Source code with:
  * README.md (setup, run, test, build, docker usage),
  * Clear instructions for running unit and E2E tests.
* Passing unit and E2E tests.

## 3 Further Help

Get in touch with us on temporary Slack channel dedicated to this challenge.
