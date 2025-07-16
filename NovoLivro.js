let pagina1 = document.querySelector('.card1');
let pagina2 = document.querySelector('.card2');
let body = document.querySelector('body');

document.querySelector('#botao1').addEventListener('click', function(){
pagina1.style.display="none";
pagina2.style.display="flex";
body.style.backgroundImage="url(https://sdmntprwestus2.oaiusercontent.com/files/00000000-9194-61f8-b62c-d6dc7e7375ae/raw?se=2025-07-15T20%3A47%3A17Z&sp=r&sv=2024-08-04&sr=b&scid=0e9d4367-50fe-5567-bb09-ff28ce737bf4&skoid=c953efd6-2ae8-41b4-a6d6-34b1475ac07c&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-15T19%3A29%3A50Z&ske=2025-07-16T19%3A29%3A50Z&sks=b&skv=2024-08-04&sig=dpmIGrTLZ%2BjrHzqQ3MBDDGYxOw0cWpZ28BMrEUlNSK4%3D)";
})
