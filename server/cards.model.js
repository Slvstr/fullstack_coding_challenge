(function() {
  'use strict';

  var cards = [
    {
      firstName: 'Levi',
      age: 27,
      profilePic: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAFCAAAAJGM1NjMwYThjLWRiZGYtNGNiZi1iNTIxLWI1MTkwYWJkNmU5Nw.jpg',
      mutualFriendsCount: 1,
      sharedInterestsCount: 3
    },
    {
      firstName: 'Sean',
      age: 30,
      profilePic: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/2/000/2be/296/1a5ca83.jpg',
      mutualFriendsCount: 0,
      sharedInterestsCount: 5
    },
    {
      firstName: 'Ryan',
      age: 31,
      profilePic: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/7/005/08c/0e4/1bd4187.jpg',
      mutualFriendsCount: 0,
      sharedInterestsCount: 1
    },
    {
      firstName: 'Rosette',
      age: 24,
      profilePic: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAT6AAAAJDFmMmNjNzY4LWZiNTUtNDU1Ny1hNmJmLWFlZGYzMjVmM2RjOA.jpg',
      mutualFriendsCount: 2,
      sharedInterestsCount: 0
    },
    {
      firstName: 'Lisa',
      age: 25,
      profilePic: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAcWAAAAJDdkYjU4ODE1LTc1OTQtNDJkMC1iZmQzLTYzZWQ1NWY4MWRlNg.jpg',
      mutualFriendsCount: 11,
      sharedInterestsCount: 13
    }
  ];

  module.exports.findAll = function findAllCards() {
    return cards;
  };

})();