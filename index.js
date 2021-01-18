const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('./config.json')//토큰, 접두사(프리픽스)
const command = require('./command')//어떤 커맨드가 실행중인지 파악
const firstMessage = require('./first-message')//시작시 개발자에게 메시지 전송
const privateMessage = require('./private-message')//행동이가 dm에서도 답변해줌
const roleClaim = require('./role-claim')//역할주기

client.on('ready', () => {//준비 메시지
  console.log('The client is ready!');
//799452865349156905가 있는 자리에 채널아이디를 넣으면 됨
  firstMessage(client, '799452865349156905', '행동이(는)가 깨어났다!', ['😎', '🧨'])
  privateMessage(client, '야', '얼마나 할말이 없으면 dm으로 말하지...?')
  privateMessage(client, '행동아', '폭1팔')
  privateMessage(client, '빅스비', '그거 그렇게 하는 거 아닌데 ㅋㅋㅋ')
  privateMessage(client, '무 무슨', '와!월수!아시는구나!!')
  privateMessage(client, '니...니가 먼저 말걸었잖', '어쩌라는 거지..?')
  privateMessage(client, '너 만든 사람', '그 사람은 도대체 뭔 생각으로 이런 대사를 넣었지..?')
  privateMessage(client, '문의', '문의 그딴 건 없단다...우힣ㅎㅎ힣')

  roleClaim(client)

  client.users.fetch(['708941330239324211']).then(user => {//개발자에게 감동의메시지...?
    user.send(`:middle_finger: 이거나 먹어라!`)
  })
});
  command(client, ['핑', '테스트'], message => {//테스트 커맨드
    message.channel.send('퐁!!')
  })

  command(client, '서버정보', message => {//서버정보 커맨드
    const { guild } = message

    const { name, region, memberCount, owner, afkTimeout } = guild//guild에 서버의 정보입력
    const icon = guild.iconURL()

    const embed = new Discord.MessageEmbed()//임베드 생성
      .setTitle(`"${name}의 서버정보는요"`)//타이틀에 name의 서버정보(서버이름)의 서버정보
      .setThumbnail(icon)//icon은 서버의 아이콘을 불러온다
      .addFields({//필드를 만든다
        name: '국가(나라위치)',
        value: region,//나라 불러오기
      },
      {
        name: '총멤버',
        value: memberCount,//멤버수 불러오기
      },
      {
        name: '서버주인',
        value: owner, //주인 맨션
      },
      {
        name: 'AFK_TIME_OUT',//잠수 오버로드
        value: afkTimeout / 60,
      }
    )

    message.channel.send(embed)//완성된 임베드 수신
  })
  command(client, ['채삭', '채널메시지삭제'], message => {//채널내 모든메시지 삭제 커맨드
    if(message.member.hasPermission('ADMINISTRATOR')) {//관리자 권한이라면
      message.channel.messages.fetch().then((results) => {
        message.channel.bulkDelete(results)
        message.channel.send(`폭1파 시켜러렸따..🎇`)//엄청나게 지우기
      })
    }
  })

  command(client, '스탯', message => {//봇의 스탯커맨드
    const content = message.content.replace('행동아 스탯 ', '')
//'행동아 스탯 김철수'라고 한다면 김철수 하는중이라고 상태메시지에 표시됨
    client.user.setPresence({
      activity: {
        name: content,
        type: 0
      }
    })
  })

  command(client, '대화채널만들어', message => {//채널만들기 커맨드
    const name = message.content.replace('행동아 대화채널만들어 ', '')

    message.guild.channels//채널을 만드는데
      .create(name, {//타입설정
        type: 'text',
      })
      .then((channel) => {//카테고리 설정
        const categoryId = '798771225597837343'//자신의 카테고리 아이디 입력
        channel.setParent(categoryId)
      })
  })

  command(client, '음악채널만들어', (message) => {//보이스 채널 만들기 커맨드
    const name = message.content.replace('행동아 보이스채널만들어 ', '')

    message.guild.channels.create(name, {
      type: 'voice',
    })
      .then((channel) => {
        channel.setUserLimit(2)//봇과 자신까지만 허용
        const categoryId = '798771225597837344'//카테고리 아이디
        channel.setParent(categoryId)
      })
  })

  command(client, '밴', message => {
    const { member, mentions } = message
    
    const tag = `<@${member.id}>`

    if(member.hasPermission('ADMINISTRATOR') || member.hasPermission('BAN_MEMBER')) {
      const target = mentions.users.first()
      if(target) {
        const targetMember = message.guild.members.cache.get(target.id)
        targetMember.ban()
        message.channel.send(`${tag} 걔 밴함`)
      } else {
        message.channel.send(`${tag} 누굴 밴할건지 정해야지 ew...||으휴||`)
      }
    } else {
      message.channel.send(`${tag} 님 권한부족임 쿠쿠루뿡뿡`)
    }
  })

  command(client, '킥', message => {
    const { member, mentions } = message
    
    const tag = `<@${member.id}>`

    if(member.hasPermission('ADMINISTRATOR') || member.hasPermission('KICK_MEMBER')) {
      const target = mentions.users.first()
      if(target) {
        const targetMember = message.guild.members.cache.get(target.id)
        targetMember.kick()
        message.channel.send(`${tag} 걔 킥함`)
      } else {
        message.channel.send(`${tag} 누굴 킥할건지 정해야지 ew...||으휴||`)
      }
    } else {
      message.channel.send(`${tag} 님 권한부족임 쿠쿠루뿡뿡`)
    }
  })

  command(client, '샌즈전', message => {//심심해서 만든 커맨드
    const logo = 
    'https://i.ytimg.com/vi/7Ewl9dHY2cU/maxresdefault.jpg'

    const embed = new Discord.MessageEmbed()//임베드 생성
    .setTitle('샌즈와 시간을 보내고 싶으시다면 <--링크클릭')//대표글
    .setURL('https://jcw87.github.io/c2-sans-fight/')//링크//글에 링크추가
    .setAuthor(message.author.username)
    .setImage(logo)//로고불러오기//병맛로고
    .setThumbnail(logo)//귀찮아서...
    .setFooter('와!샌즈!아시는구나!')
    .setColor('#00AAFF')//블루우
    .addField({
      name: '샌즈',
      value: '겁.나.어.렵.습.니.다',
      inline: true,
    },
    {
      name: '언더테일',
      value: '단순하지만 재밌는게임',
      inline: true,
    },
    {
      name: '잼민이',
      value: '잼민겜 아닌뒈.',
      inline: true,
    }
  )

    message.channel.send(embed)
})

command(client, ['도와줘', '도움!!!', 'help', '도움말'], message => {
    message.channel.send(`
      **행동아 도와줘 - 도움말 메뉴를 띄어줍니다**(행동이 영어급나 잘함||레알 쿠쿠루뿡뿡||)
      **행동아 덧셈 <num1> <num2>** - 두 개의 숫자를 더함
      **행동아 빼기 <num1> <num2>** - 두 개의 숫자를 뺌
    `)//간단한 명령어.(도움말 명령어)

  const { prefix } = config
  client.user.setPresence({
    activity: {
      name: `"${prefix}도와줘" 라고 하면 도와줄걸요`
    }
  })
})

client.login(config.token)