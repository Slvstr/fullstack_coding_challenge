Tinder Full Stack Coding Challenge
===================================

* Link to working example: https://limitless-atoll-2133.herokuapp.com/
* How long it took to complete: Roughly 16 hours (the majority of which was spent tweaking CSS)
* Future additions:
  * Keep track of matches for later viewing (trivial)
  * Add logic to fetch more cards when the stack is running low
  * Improve performance by only creating a handful of card elements and reusing them
  * Add a global chat room on the message tab
  * Add the spring effect to the stack (raised as the top card moves off center, lowered as it is reset)

**Tech Stack**
* AngularJS
* Angular-Hammer
* Node.js + Express

**Running Locally**
* `npm install` (postinstall script will run `bower install` and `gulp inject`)
* `npm start`

### Recreate the Tinder card stack in html/js/css.

<img src="http://i.imgur.com/nh8oB6C.gif" />

**At a minimum, this must:**

* Recognize swipe left and swipe right gestures (we recommend hammer.js for gesture recognition)
* Render properly on an iPhone 6
* Populate "cards" using data from a backend API endpoint (this can be static json)

**Bonus points for:**

* Doing it all in vanilla js
* Using node.js, go, or python for your backend
* Making the site responsive so it works well on desktop and arbitrary screen sizes
* Including a gamepad
* Bringing up the It's a match! screen on right swipe
* Adding cool features

**Third Party Libraries:**

We use react and angular internally, so including one of those in your submission is a plus.

If you're pressed for time you can submit your solution with a library like https://github.com/gajus/angular-swing doing the heavy lifting of card swiping logic, although we will deduct points for that. Reading the source of such a library for "inspiration" is totally fine though.

**Evaluation:**

We will be evaluating your submission on both the efficiency and readability of your code and the degree to which your product matches the native experience.

Please submit your solution as a pull request to this repository or email a zip directly to your recruiter, and include in it:

* a link to your working example
* how long this took you
* what you would add/change if you had more time

Thanks, and have fun!
