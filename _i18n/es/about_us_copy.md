VaccinateCA es un esfuerzo impulsado por la comunidad para ayudar a los californianos a obtener información precisa, actualizada y verificada sobre la vacuna contra el coronavirus, para que puedan saber cuándo serán elegibles y cómo ocupar su lugar en la fila.

Nuestros profesionales llaman a los profesionales médicos a cientos de posibles lugares de vacunación a diario, preguntándoles si tienen la vacuna y, de ser así, a quién se la administrarán y cómo concertar una cita. Escribimos lo que nos dicen y lo publicamos en este sitio.

<h2 class="text-2xl font-bold leading-tight text-gray-900 mt-8 mb-4">Preguntas frecuentes (FAQ)</h2>

<b>¿Cómo puedo ayudar?</b>

Haga correr la voz sobre la vacuna en su comunidad. Ayude a sus seres queridos elegibles a recibir la vacuna. Continúe usando su máscara y observe las pautas de distanciamiento social.

No necesitamos más voluntarios en este momento; estamos eliminando esto de nuestras redes para avanzar lo más rápido posible. Esto puede cambiar en unos días; Vuelva a consultar las actualizaciones o <a href="https://twitter.com/{{ site.twitter_username }}">síganos en Twitter</a> .

Tampoco necesitamos dinero. Muchos proyectos de caridad lo <i>hacen</i> ; agradecerían su generoso apoyo.

<b>Soy un reportero ¿Puedo ponerme en contacto?</b>

Envíe un correo electrónico a <a href="mailto:media@vaccinateca.com">media@vaccinateca.com</a> ; nos pondremos en contacto rápidamente.

<b>¡Trabajo en un proveedor médico! ¿Cómo le pido que actualice nuestra información o le haga una solicitud?</b>

¡Apreciamos el trabajo que está haciendo y estamos aquí para apoyarlo!

Envíe un mensaje de texto al <a href="tel:+14153014597">(415) 301-4597</a> con su mensaje, afiliación institucional y una extensión interna o nombre de contacto para que podamos llamar para verificar. No podemos recibir fotos en este número; solo texto, por favor.

Uno de los organizadores leerá su mensaje y tomará medidas tan pronto como sea razonablemente posible.

<b>Trabajo en una organización de cara a la comunidad o para el gobierno. ¿Podemos discutir esto?</b>

Queremos apoyar el trabajo urgente que está haciendo para vacunar a los californianos lo más rápido posible. Envíenos un correo electrónico a <a href="mailto:partners@vaccinateca.com">partners@vaccinateca.com</a> para discutir.

<b>¿Este esfuerzo aumenta o disminuye la fatiga en el sistema de salud?</b>

La mayoría de los hospitales reciben miles de llamadas telefónicas al día. Actualmente están siendo criticados por muchas más personas de lo habitual haciéndoles la misma pregunta: &quot;¿Tienen la vacuna?&quot;

Al hacer esa pregunta y publicar la respuesta, podemos ahorrar el ancho de banda de su teléfono para las operaciones diarias del hospital. También evitamos que las personas que buscan la vacuna tengan que llamar a docenas de ubicaciones para encontrar una que tenga disponibilidad.

<b>¿Es precisa la información de este sitio web?</b>

Publicamos solo lo que el sitio de la vacuna nos dijo cuando llamamos. La situación es compleja, los suministros pueden variar a lo largo del día y es posible que no todos en el sitio tengan información actualizada sobre cuáles son sus políticas.

Estamos haciendo nuestro mejor esfuerzo, pero no podemos ofrecer ninguna garantía.

<b>¿Quién eres tú?</b>

Somos una organización impulsada por la comunidad, con más de 300 voluntarios trabajando con nosotros. Al 23 de enero de 2021, nuestro equipo central era de aproximadamente 20 personas.

Algunos de los que trabajamos en este proyecto el día 1: <span id="people-list">{% for coordinator in site.data.coordinators%} <a href="{{ coordinator[1] }}">{{coordinator [0]}}</a> {% endfor%}</span> .


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
