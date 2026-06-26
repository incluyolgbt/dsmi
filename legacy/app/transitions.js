export default function () {
  this.transition(
    this.hasClass('liquid-container'),
    this.use('fade', { duration: 200 }),
  );
}
