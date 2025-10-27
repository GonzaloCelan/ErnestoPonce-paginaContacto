    // Ripple
    document.querySelectorAll('.btn').forEach(btn=>{
      btn.addEventListener('click', e => {
        const r = document.createElement('span');
        r.className = 'ripple';
        const rect = btn.getBoundingClientRect();
        r.style.left = (e.clientX - rect.left) + 'px';
        r.style.top  = (e.clientY - rect.top)  + 'px';
        btn.appendChild(r);
        setTimeout(()=> r.remove(), 620);
      });
    });

    // "Press" en mobile
    function pressable(selector, pressedClass='pressed'){
      document.querySelectorAll(selector).forEach(el=>{
        el.addEventListener('touchstart', ()=> el.classList.add(pressedClass), {passive:true});
        ['touchend','touchcancel','touchmove'].forEach(evt=>
          el.addEventListener(evt, ()=> el.classList.remove(pressedClass), {passive:true})
        );
      });
    }
    pressable('.btn'); pressable('.social a');

    // Reiniciar animación del logo
    document.addEventListener('DOMContentLoaded', ()=>{
      const logo = document.querySelector('.avatar');
      if(logo){ logo.classList.remove('coin'); void logo.offsetWidth; logo.classList.add('coin'); }
    });

    // Secuencia
    const avatar = document.querySelector('.avatar');
    function startCascade(){
      const h1 = document.querySelector('h1');
      const sub = document.querySelector('.sub');
      const desc = document.querySelector('.desc');
      h1?.classList.add('in');
      setTimeout(()=> sub?.classList.add('in'), 140);
      setTimeout(()=> desc?.classList.add('in'), 260); // mostrar desc antes de escribir

      const lines = [...document.querySelectorAll('.desc .line')];
      const speedPerChar = 35;         // ms por carácter
      let acc = 400;                   // pequeño delay inicial

      lines.forEach((line)=>{
        const n = parseInt(getComputedStyle(line).getPropertyValue('--n')) || line.textContent.length;
        const writeMs = n * speedPerChar;

        setTimeout(()=> line.classList.add('typing'), acc);                         // comenzar a escribir
        setTimeout(()=> {                                                           // fijar estado final
          line.classList.remove('typing');
          line.classList.add('done');                                               // mantiene width y apaga cursor
        }, acc + writeMs + 16);

        acc += writeMs + 260; // pausa entre líneas
      });

      // Botones, redes, nota después del texto
      const buttons = [...document.querySelectorAll('.links .btn')];
      buttons.forEach((el,i)=> setTimeout(()=> el.classList.add('in'), acc + i*140));
      setTimeout(()=> document.querySelector('.social')?.classList.add('in'), acc + buttons.length*140 + 100);
      setTimeout(()=> document.querySelector('.note')?.classList.add('in'),   acc + buttons.length*140 + 220);
    }
    avatar?.addEventListener('animationend', startCascade, { once:true });
    setTimeout(()=>{ if(!document.querySelector('h1')?.classList.contains('in')) startCascade(); }, 1400);