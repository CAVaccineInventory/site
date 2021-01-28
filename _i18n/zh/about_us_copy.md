VaccinateCA是一项由社区推动的工作，旨在帮助加利福尼亚人学习有关冠状病毒疫苗的准确，最新且经过验证的信息，以便他们可以了解自己何时有资格以及如何排队。

我们的专业人员每天都会在数百个潜在的疫苗接种地点给医疗专业人员打电话，询问他们是否有疫苗，如果有疫苗的话，将对谁进行管理以及如何预约。我们记下他们告诉我们的内容，并将其发布到本网站。

<h2 class="text-2xl font-bold leading-tight text-gray-900 mt-8 mb-4">常见问题解答（FAQ）</h2>

**我能提供什么帮助？**

宣传社区中的疫苗。帮助您的合格亲人获得疫苗。继续戴上口罩，并遵守社交疏导准则。

我们现在不需要更多的志愿者。我们正在用尽我们的网络，以便尽快迁移。几天后可能会改变。请查看更新或[在Twitter上关注我们]（https://twitter.com/ {{site.twitter_username}}）。

我们也不需要钱。许多慈善项目他们将感谢您的大力支持。

**我是记者。我可以联系吗？**

请发送电子邮件至[media@vaccinateca.com]（mailto：media@vaccinateca.com）；我们会尽快与您联系。

**我在医疗服务提供者上班！我如何要求您更新我们的信息或向您提出要求？**

我们感谢您正在做的工作，并随时为您提供支持！

请给[[415）301-4597]（tel：+14153014597）发短信，并附上您的信息，机构名称，内部分机号或联系人姓名，以便我们回电进行验证。我们无法使用该号码接收照片；请只输入文字。

一位组织者将阅读您的消息，并尽快采取行动。

**我在面向社区的组织或为政府工作。我们可以讨论一下吗？**

我们希望支持您为尽快为加利福尼亚人接种疫苗所做的紧急工作。请给我们发电子邮件[partners@vaccinateca.com]（mailto：partners@vaccinateca.com）进行讨论。

**这种努力会增加还是减少医疗保健系统中的工作量？**

大多数医院每天都会接到数千个电话。目前，他们比平时受到更多人的猛烈抨击，问他们同样的问题：“您有疫苗吗？”

通过询问该问题并发布答案，我们可以为医院的日常操作节省他们的电话带宽。我们还使寻求疫苗的人们不必打电话到数十个地点来找到有这种疫苗的地点。

**此网站上的信息准确吗？**

我们只发布疫苗网站在我们致电时告诉我们的内容。情况很复杂，一天中的供应可能会有所不同，而且并非站点上的每个人都可能掌握有关其实际政策的最新信息。

我们正在尽力而为，但不能做出任何保证。

**你是谁？**

我们是一个社区驱动的组织，有300多名志愿者与我们合作。截至2021年1月23日，我们的核心团队大约有20人。

我们中有些人在第1天参与了该项目： <span id="people-list">
{% for coordinator in site.data.coordinators %} [{{ coordinator[0] }}]({{ coordinator[1] }}) {% endfor %}
</span>。


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
