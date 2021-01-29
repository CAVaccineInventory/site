VaccinateCA es impulsado por la comunidad en un esfuerzo para ayudar a los californianos a aprender precisa, al corriente, verificada información sobre la corona virus vacuna para que puedan aprender cuándo serán elegibles y cómo tomar su espacio en la línea. 

Nuestros profesionales llaman a médicos profesionales a cientos de potenciales sitios de vacunación diariamente, preguntándoles si tienen la vacuna y si, a quienes lo administran y cómo obtener una cita. Escribimos lo que nos dicen y lo publicamos en este sitio.

<h2 class="text-2xl font-bold leading-tight text-gray-900 mt-8 mb-4">Preguntas frecuentes (FAQ)</h2>

<b>¿Cómo te puedo ayudar?</b>

Corre la voz sobre la vacuna en tu comunidad. Ayuda a tus seres queridos elegibles a obtener la vacuna. Sigue usando tu máscara y observa las normas del distanciamiento social. 

No ocupamos más voluntarios en este momento; estamos corriendo esto desde nuestra red para movernos lo más rápido posible. Esto puede cambiar en los próximos días; cheque de regreso por actualizaciones o <a href="https://twitter.com/{{ site.twitter_username }}">siguenos en Twitter</a> .

Tampoco ocupamos dinero. Muchos proyectos de caridad<i>si</i> ; ellos aprecian mucho su generoso apoyo.

<b>Soy reportero. ¿Cómo los puedo contactar?</b>

Por favor enviar correo electrónico a <a href="mailto:media@vaccinateca.com">media@vaccinateca.com</a> ; estaremos en contacto rápidamente.

<b>¡Trabajo en un proveedor médico! ¿Cómo te pregunto que actualicen su información o hago una solicitud?</b>

¡Apreciamos el trabajo que está haciendo y estamos aquí para apoyarlo!

Por favor mandar texto al <a href="tel:+14153014597">(415) 301-4597</a> con tu mensaje, afiliación institucional, y una extensión interna o nombre de contacto para devolverle la llamada para verificar. No podemos recibir fotos en este número; solo texto, por favor.

Uno de los organizadores leyeron tu mensaje y tomarán acción lo más pronto razonablemente posible.

<b>Yo trabajo en una comunidad-frente organización o por el gobierno. ¿Podremos discutir esto? </b>

También queremos apoyar el trabajo urgente que está haciendo en vacunar a los californianos lo más pronto posible. Por favor de mandar correo electrónico a <a href="mailto:partners@vaccinateca.com">partners@vaccinateca.com</a> para discutir.

<b>Este esfuerzo incrementa o crea disminución en el agotado sistema de salud?</b>

 

La mayor parte de hospitales reciben miles de llamadas por teléfono al día. Actualmente están siendo golpeados por muchas más gente que usual preguntado la misma pregunta: &quot;¿Tienen la vacuna?&quot;

Por preguntar esa pregunta y publicando la respuesta, podemos salvar sus la capacidad de sus teléfonos para los dia a dia operaciones del hospital. También salvamos a gente buscando la vacuna de tener que hacer llamadas a decenas de locaciones para encontrar alguna con disponibilidad.

<b>¿Es precisa la información de la página web?</b>

Solo publicamos lo que el sitio de vacunación nos ha dicho cuando hemos llamado. La situación es compleja, los suministros pueden variar conforme va el día, y no todo en el sitio pueden tener información de minuto-a-minuto sobre cuáles son sus pólizas.

Estamos haciendo nuestro mejor esfuerzo, pero no podemos ofrecer ningunas garantías. 

<b>¿Quién eres tú?</b>

Nosotros somos una organización impulsada por la comunidad, con más de 300 voluntarios trabajando con nosotros. Desde Enero 23, 2021, nuestro centro equipo era de aproximadamente 20 personas. 

Algunos de nosotros hemos trabajado en este proyecto desde el primer día: : <span id="people-list">{% for coordinator in site.data.coordinators%} <a href="{{ coordinator[1] }}">{{coordinator [0]}}</a> {% endfor%}</span> .


<script>
// From https://stackoverflow.com/a/12646864
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const peopleElements = [...document.querySelectorAll('#people-list a')];
const peopleListElement = document.querySelector("#people-list");

shuffleArray(peopleElements);
peopleListElement.innerHTML = "";
for (let i = 0; i < peopleElements.length; ++i) {
  const personElement = peopleElements[i];

  peopleListElement.insertBefore(personElement, null);
  if (i !== peopleElements.length - 1) {
    const separatorNode = document.createTextNode(", ");
    peopleListElement.insertBefore(separatorNode, null);
  }
}
</script>
