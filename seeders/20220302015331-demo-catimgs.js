'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('catpics', 
    [
  {
        imgurl: 'https://cdn2.thecatapi.com/images/9hl.jpg',
        picid: 'ack',
        alttext: 'happy cat drawn in chalk with large orange cat looking at you with disapproval',
        createdAt: new Date(),
        updatedAt: new Date()
      }, 
        {
        imgurl: 'https://cdn2.thecatapi.com/images/aua.jpg',
        picid: 'aua',
        alttext: 'long-haired, brown, and black cat staring excitedly at confetti coming down',
        createdAt: new Date(),
        updatedAt: new Date()
      }, 
        {
        imgurl: 'https://cdn2.thecatapi.com/images/e4l.jpg',
        picid: 'e4l',
        alttext: 'orange little fluffy balled cat looking grumpy',
        createdAt: new Date(),
        updatedAt: new Date()
      }, 
        {
        imgurl: 'https://cdn2.thecatapi.com/images/aWVfoSN_K.jpg',
        picid: 'aWVfoSN_K',
        alttext: '2 cats, white one on a hammock looking content',
        createdAt: new Date(),
        updatedAt: new Date()
      } 
      ],{});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('catpics', null, {});
  }
};