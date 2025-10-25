export default defineContentScript({
  matches: ['https://www.notion.so/*'],
  main() {
    alert(1);
    console.log('Hello content.');
  },
});
