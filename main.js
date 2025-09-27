window.addEventListener('load', async ()=>{
  let [timerBtn, rewardBtn] = [document.querySelector('.navigate-timer'), document.querySelector('.navigate-reward')];
  loadPage(html.home, logic.home);
  timerBtn.classList.add('active');
  rewardBtn.classList.remove('active');
  timerBtn.addEventListener('click', ()=>{
    document.querySelector('.reward-shop').remove();
    loadPage(html.home, logic.home);
    timerBtn.classList.add('active');
    rewardBtn.classList.remove('active');
  })
  rewardBtn.addEventListener('click', ()=>{
    document.querySelector('.pomodo-timer').remove();
    loadPage(html.reward, logic.reward);
    timerBtn.classList.remove('active');
    rewardBtn.classList.add('active');
  })
  function loadPage(html, logic){
    html();
    logic();
    window.scrollTo(0, document.body.scrollHeight);  // Scroll to bottom
  }
})
