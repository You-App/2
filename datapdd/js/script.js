$( document ).ready(function() { 	
	test.init("datapdd");
});

var test = {
	statDir: "", 
	seconds: 0,
	minutes: 0,
	timerId: 0,
	NameSet: 'ab',
	typeTest: 'Экзамен',
	countQuest: 0,
	CurrentArray: [],
	CurrentQuest: 0,	
	Answers: [],
	countWrongAnswer: 0,
	mainDataArray: [],
	Select: false,
	Pass: true,
	myPagination: null,
	pause: false,
	init: function(statName) {
		test.statDir = statName;

		test.initMenu();
		test.loadTicket(1);
		$('.overlay-scrollbars').overlayScrollbars({ });
		
		$("#questList").on("click", "a.nameTicket", function(){						
			test.loadTicket(0,$(this).data("id"));
			test.typeTest = $(this).text();			
		});
		
		$("#questList").on("click", "a.nameTheme", function(){			
			test.loadTicket(2, $(this).data("id"));			
			test.typeTest = $(this).text().replace("      ", "").split(" -")[0];	
		});

		$( "#btnRNG" ).click(function() {
			test.typeTest="Экзамен";
			
			test.updateQuestList(1);	
			test.loadTicket(1);	
		});

		$( "#btnBiletList" ).click(function() {
			test.typeTest="Экзамен";
			
			test.updateQuestList(0);	
			test.loadTicket(1);				
		});
		
		$( "#btnThemeList" ).click(function() {	
			test.updateQuestList(2);			
		});

		$( "#btnMarathon" ).click(function() {
			test.typeTest = "Марафон";						

			test.updateQuestList(3);	
			test.loadTicket(3);				
		});
		
		$("#ticketView").on("click", "span#timer", function(){						
			test.pause = !test.pause;
			$("#timer").toggleClass("label-success");
			$("#timer").toggleClass("label-danger");
			
			$("#iconControl").toggleClass("icon-play");
			$("#iconControl").toggleClass("icon-pause");
					
		});
		
		$( "#btnAB" ).click(function() {
			$(this).addClass("btn-info");
			$('#btnCD').removeClass("btn-info");

			test.NameSet='ab';
			test.typeTest="Экзамен";

			test.updateQuestList(0);	
			test.loadTicket(1);
		});
		
		$( "#btnCD" ).click(function() {
			$(this).addClass("btn-info");
			$("#btnAB").removeClass("btn-info");

			test.NameSet='cd';	
			test.typeTest="Экзамен";

			test.updateQuestList(0);
			test.loadTicket(1);
		});

		test.myPagination = new Pagination({
			classSelect: "btn-warning",
			classBlock: "#btnBilet",
			classPage: ".btn-page",
			classPageChildren: ".btnTicket",
			tagPage: "",
			maxHeight: "34",
			callbackSelectPage: function(elem, index){
				test.CurrentQuest = parseInt($(elem).attr('id').replace(/ticket_/, ''));
				test.Select = false;
				test.myPagination.setVesiblePage(index);
				
				if (test.CurrentQuest >-1) 
				{	
					$("#ticketView").empty();
					test.showQuest();

					$("#answer").on("click", "a.answerText", function(){
						if (test.Answers[test.CurrentQuest] ==0 || test.Select == true) {

							if ($(".answerText").index(this) == test.CurrentArray[test.CurrentQuest]['otvet']) {
								$(this).addClass("success"); 
								$('#panelTest').css('display','block');
								if (test.Select == false){
									test.Answers[test.CurrentQuest] = $(this).attr('id');
									
									$("#ticket_"+test.CurrentQuest).addClass("btn-success");
									
									if (test.checkTestEnd() == true) test.addEndTest(1);
									else $("button.next").trigger( "click" );
									
								}
							}
							else {
								$(this).addClass("warning"); 
								$('#panelTest').css('display','block'); 

								$("#answer_" + test.CurrentArray[test.CurrentQuest]['otvet']).addClass("success");
								if (test.Select == false){
									test.Answers[test.CurrentQuest] = $(this).attr('id');
									
									if (test.countWrongAnswer<2 && test.typeTest == 'Экзамен' && test.Pass == true){
										if (test.CurrentQuest<20) 
											test.addMoreQuest(test.CurrentQuest);
										else test.Pass = false;
									}
									
									$("#ticket_"+test.CurrentQuest).addClass("btn-danger");										
									test.countWrongAnswer++;
									
									if (test.checkTestEnd() == true) test.addEndTest(0);
								}										
							}									
						}
					});
						
					$("#panelTest").on("click", "button.next", function(){
						for (var i=test.CurrentQuest+1; i<test.countQuest;i++)
						{
							if (test.Answers[i]==0) {
								$("#ticket_"+(i)).trigger( "click" );
								test.myPagination.setVesiblePage(i);
								return;
							}
						}
						
						for (var i=0; i<test.CurrentQuest;i++)
						{
							if (test.Answers[i]==0) {
								test.myPagination.setVesiblePage(i);
								$("#ticket_"+(i)).trigger( "click" );
								return;
							}
						}
						
						test.myPagination.setVesiblePage(test.CurrentQuest+1);
						$(".btnTicket").last().trigger( "click" );
					});

					if (test.Answers[test.CurrentQuest] !=0) {
						test.Select = true; 
						$("#"+test.Answers[test.CurrentQuest]).trigger( "click" );
						$("#answer_" + test.CurrentArray[test.CurrentQuest]['otvet']).addClass("success");
					}			
				}
				else test.showEnd(); 
			}
		});
	}, 
	selectButtonLabel: function(elem, stringSelect,classSelect)
	{
		$(elem).addClass(classSelect);
		$(stringSelect).not(elem).removeClass(classSelect);
	},
	initMenu: function() {

		test.mainDataArray = {'ab': ['1_2','1_3','1_4','1_5','1_8','1_9','1_10','1_11','1_12','1_13','1_14','1_15','1_16','2_1','2_2','2_3','2_4','2_5','2_6','2_7','2_8','2_9','2_11','2_12','2_13','2_14','2_15','2_16','3_1','3_2','3_3','3_4','3_5','3_6','3_8','3_9','3_10','3_12','3_13','3_14','3_15','3_16','4_1','4_2','4_3','4_4','4_6','4_7','4_8','4_9','4_11','4_12','4_13','4_14','4_15','5_1','5_2','5_3','5_4','5_5','5_7','5_8','5_9','5_10','5_11','5_12','5_13','5_14','5_15','5_16','5_20','6_2','6_3','6_4','6_5','6_7','6_8','6_9','6_10','6_11','6_12','6_13','6_14','6_15','6_19','7_2','7_3','7_4','7_5','7_6','7_8','7_9','7_11','7_12','7_13','7_14','7_15','7_17','8_2','8_3','8_4','8_5','8_6','8_7','8_8','8_9','8_10','8_11','8_12','8_13','8_14','8_15','9_2','9_3','9_4','9_5','9_6','9_8','9_9','9_10','9_11','9_12','9_13','9_14','9_15','9_19','10_1','10_2','10_3','10_4','10_5','10_6','10_7','10_8','10_9','10_11','10_13','10_14','10_15','10_16','11_2','11_3','11_4','11_5','11_7','11_8','11_9','11_12','11_13','11_14','11_15','11_19','12_2','12_3','12_4','12_5','12_7','12_8','12_9','12_10','12_11','12_12','12_13','12_14','12_15','12_19','13_1','13_2','13_3','13_4','13_5','13_6','13_8','13_9','13_10','13_11','13_12','13_13','13_14','13_15','13_16','14_2','14_3','14_4','14_5','14_6','14_7','14_8','14_9','14_11','14_12','14_13','14_14','14_15','14_16','15_2','15_3','15_4','15_5','15_6','15_7','15_8','15_9','15_12','15_13','15_14','15_15','15_16','16_2','16_3','16_4','16_5','16_6','16_8','16_9','16_10','16_11','16_12','16_13','16_14','16_15','16_16','16_19','17_2','17_3','17_4','17_5','17_6','17_7','17_8','17_9','17_11','17_12','17_13','17_14','17_15','17_16','18_2','18_3','18_4','18_5','18_6','18_7','18_8','18_9','18_11','18_12','18_13','18_14','18_15','18_16','19_1','19_2','19_3','19_4','19_6','19_8','19_9','19_10','19_11','19_12','19_13','19_14','19_16','20_2','20_3','20_4','20_6','20_7','20_8','20_9','20_10','20_11','20_12','20_13','20_14','20_15','20_16','21_2','21_3','21_4','21_5','21_6','21_7','21_8','21_10','21_11','21_12','21_13','21_14','21_15','21_17','21_19','22_1','22_3','22_4','22_6','22_7','22_8','22_9','22_12','22_13','22_14','22_15','23_1','23_2','23_3','23_4','23_5','23_6','23_8','23_9','23_10','23_11','23_12','23_13','23_14','23_15','23_16','24_2','24_3','24_4','24_5','24_7','24_8','24_9','24_10','24_11','24_12','24_13','24_14','24_15','24_16','25_1','25_2','25_3','25_4','25_5','25_6','25_7','25_8','25_9','25_11','25_12','25_14','25_15','25_16','26_1','26_2','26_3','26_5','26_7','26_8','26_9','26_10','26_12','26_13','26_14','26_15','26_17','27_2','27_3','27_4','27_5','27_7','27_8','27_9','27_10','27_12','27_13','27_14','27_15','27_16','27_20','28_2','28_3','28_4','28_5','28_6','28_8','28_9','28_10','28_11','28_12','28_13','28_14','28_15','28_16','29_2','29_3','29_4','29_5','29_6','29_8','29_9','29_10','29_11','29_12','29_13','29_14','29_15','29_16','30_1','30_2','30_3','30_4','30_5','30_6','30_8','30_9','30_10','30_12','30_13','30_14','30_15','31_2','31_3','31_4','31_6','31_7','31_8','31_9','31_11','31_12','31_13','31_14','31_15','31_16','32_2','32_3','32_4','32_5','32_6','32_7','32_9','32_12','32_13','32_14','32_15','32_19','33_1','33_2','33_3','33_4','33_5','33_8','33_9','33_11','33_12','33_13','33_14','33_15','33_16','34_1','34_2','34_3','34_4','34_5','34_6','34_8','34_9','34_10','34_11','34_12','34_13','34_14','34_15','34_19','35_2','35_3','35_4','35_5','35_7','35_8','35_10','35_11','35_12','35_13','35_14','35_15','36_2','36_3','36_4','36_5','36_6','36_7','36_8','36_12','36_13','36_14','36_15','36_16','37_2','37_3','37_4','37_5','37_6','37_7','37_8','37_9','37_10','37_12','37_13','37_14','37_15','38_1','38_2','38_3','38_4','38_5','38_7','38_8','38_9','38_10','38_11','38_12','38_13','38_14','38_15','39_2','39_3','39_4','39_5','39_6','39_8','39_9','39_10','39_11','39_12','39_13','39_14','39_15','39_16','40_2','40_3','40_4','40_5','40_6','40_7','40_8','40_9','40_10','40_11','40_12','40_13','40_14','40_15','40_16'],'themeab': {'1. Общие положения':25,'2. Обязанности водителей':15,'3. Дорожные знаки':157,'&nbsp;&nbsp;&nbsp;· Предупреждающие':17,'&nbsp;&nbsp;&nbsp;· Приоритета':22,'&nbsp;&nbsp;&nbsp;· Запрещающие':42,'&nbsp;&nbsp;&nbsp;· Предписывающие':18,'&nbsp;&nbsp;&nbsp;· Особых предписаний':24,'&nbsp;&nbsp;&nbsp;· Информационные':14,'&nbsp;&nbsp;&nbsp;· Сервиса':3,'&nbsp;&nbsp;&nbsp;· Таблички':68,'4. Дорожная разметка':42,'&nbsp;&nbsp;&nbsp;· Горизонтальная':37,'&nbsp;&nbsp;&nbsp;· Вертикальная':5,'5. Cпециальные сигналы':8,'6. Сигналы светофора и регулировщика':42,'&nbsp;&nbsp;&nbsp;· Светофора':19,'&nbsp;&nbsp;&nbsp;· Регулировщика':23,'7. Аварийная сигнализация':11,'8. Начало движения, маневрирование':120,'&nbsp;&nbsp;&nbsp;· Сигналы поворота':15,'&nbsp;&nbsp;&nbsp;· Начало движение, перестроение':39,'&nbsp;&nbsp;&nbsp;· Повороты':26,'&nbsp;&nbsp;&nbsp;· Разворот':26,'&nbsp;&nbsp;&nbsp;· Движение задним ходом':14,'9. Расположение ТС':25,'10. Скорость движения':27,'11. Обгон опережение разъезд':42,'&nbsp;&nbsp;&nbsp;· Обгон и опережение':35,'&nbsp;&nbsp;&nbsp;· Встречный разъезд':7,'12. Остановка и стоянка':73,'&nbsp;&nbsp;&nbsp;· Остановка':39,'&nbsp;&nbsp;&nbsp;· Стоянка':34,'13. Проезд перекрестков':121,'&nbsp;&nbsp;&nbsp;· Регулируемые':40,'&nbsp;&nbsp;&nbsp;· Нерегулируемые равнозначных дорог':40,'&nbsp;&nbsp;&nbsp;· Нерегулируемые неравнозначных':41,'14. Пеш. переходы и остановки':5,'15. Движение через ж/д пути':11,'16. Автомагистраль':15,'17. Движение в жилых зонах':9,'18. Приоритет маршрутных ТС':9,'19. Фары и сигнал':22,'20. Буксировка':10,'21. Учебная езда':4,'22. Перевозка людей':3,'23. Перевозка грузов':3,'24. Мопеды':13,'25. Неисправности и запрет':26,'26. Юридическая ответств':14,'27. Основы безопасности':60,'28. Медицина':20},'cd': ['1_2','1_3','1_4','1_5','1_8','1_9','1_10','1_11','1_12','1_13','1_14','1_15','1_16','2_1','2_2','2_3','2_4','2_5','2_6','2_7','2_8','2_9','2_11','2_12','2_13','2_14','2_15','2_16','3_1','3_2','3_3','3_4','3_5','3_6','3_8','3_9','3_10','3_12','3_13','3_14','3_15','3_16','4_1','4_2','4_3','4_4','4_6','4_7','4_8','4_9','4_11','4_12','4_13','4_14','4_15','5_1','5_2','5_3','5_4','5_5','5_7','5_8','5_9','5_10','5_11','5_12','5_13','5_14','5_15','5_16','5_20','6_2','6_3','6_4','6_5','6_7','6_8','6_9','6_10','6_11','6_12','6_13','6_14','6_15','6_19','7_1','7_2','7_3','7_4','7_5','7_6','7_8','7_9','7_11','7_12','7_13','7_14','7_15','7_17','8_2','8_3','8_4','8_5','8_6','8_7','8_8','8_10','8_11','8_12','8_13','8_14','8_15','9_2','9_3','9_4','9_5','9_6','9_8','9_9','9_10','9_11','9_12','9_13','9_14','9_15','9_19','10_1','10_2','10_3','10_4','10_5','10_6','10_7','10_8','10_9','10_11','10_13','10_14','10_15','10_16','11_2','11_3','11_4','11_5','11_7','11_8','11_9','11_12','11_13','11_14','11_15','11_16','11_19','12_2','12_3','12_4','12_5','12_7','12_8','12_9','12_10','12_11','12_12','12_13','12_14','12_15','12_19','13_1','13_2','13_3','13_4','13_5','13_6','13_8','13_9','13_10','13_11','13_12','13_13','13_14','13_15','13_16','14_2','14_3','14_4','14_5','14_6','14_7','14_8','14_9','14_11','14_12','14_13','14_14','14_15','14_16','15_2','15_3','15_4','15_5','15_6','15_7','15_8','15_9','15_12','15_13','15_14','15_15','15_16','16_2','16_3','16_4','16_5','16_6','16_8','16_9','16_10','16_11','16_12','16_13','16_14','16_15','16_16','16_19','17_2','17_3','17_4','17_5','17_6','17_7','17_8','17_9','17_11','17_12','17_13','17_14','17_15','17_16','18_2','18_3','18_4','18_5','18_6','18_7','18_8','18_9','18_11','18_12','18_13','18_14','18_15','18_16','19_1','19_2','19_3','19_4','19_6','19_8','19_9','19_10','19_11','19_12','19_13','19_14','19_16','20_2','20_3','20_4','20_6','20_7','20_8','20_9','20_10','20_11','20_13','20_14','20_15','20_16','21_2','21_3','21_4','21_5','21_6','21_7','21_8','21_10','21_11','21_12','21_13','21_14','21_15','21_17','21_19','22_1','22_3','22_4','22_6','22_7','22_8','22_9','22_12','22_13','22_14','22_15','23_1','23_2','23_3','23_4','23_5','23_6','23_8','23_9','23_10','23_11','23_12','23_13','23_14','23_15','23_16','24_2','24_3','24_4','24_5','24_7','24_8','24_9','24_10','24_11','24_12','24_13','24_14','24_15','24_16','25_1','25_2','25_3','25_4','25_5','25_6','25_7','25_8','25_9','25_11','25_12','25_14','25_15','25_16','26_1','26_2','26_3','26_5','26_7','26_8','26_9','26_10','26_12','26_13','26_14','26_15','26_17','27_2','27_3','27_4','27_5','27_7','27_8','27_9','27_10','27_12','27_13','27_14','27_15','27_16','27_20','28_2','28_3','28_4','28_6','28_8','28_9','28_10','28_11','28_12','28_13','28_14','28_15','28_16','29_2','29_3','29_4','29_5','29_6','29_8','29_9','29_10','29_11','29_12','29_13','29_14','29_15','29_16','30_1','30_2','30_3','30_4','30_5','30_6','30_8','30_9','30_10','30_12','30_13','30_14','30_15','31_2','31_3','31_4','31_6','31_7','31_8','31_9','31_11','31_12','31_13','31_14','31_15','31_16','32_2','32_3','32_4','32_5','32_6','32_7','32_9','32_12','32_13','32_14','32_15','32_19','33_1','33_2','33_3','33_4','33_5','33_8','33_9','33_11','33_12','33_13','33_14','33_15','33_16','34_1','34_2','34_3','34_4','34_5','34_6','34_8','34_9','34_11','34_12','34_13','34_14','34_15','34_19','35_2','35_3','35_4','35_5','35_7','35_8','35_10','35_11','35_12','35_13','35_14','35_15','36_2','36_3','36_4','36_5','36_6','36_7','36_8','36_12','36_13','36_14','36_15','36_16','37_2','37_3','37_4','37_5','37_6','37_7','37_8','37_9','37_10','37_12','37_13','37_14','37_15','38_1','38_2','38_3','38_4','38_5','38_7','38_8','38_9','38_10','38_11','38_12','38_13','38_14','38_15','39_2','39_3','39_4','39_5','39_6','39_8','39_9','39_10','39_11','39_12','39_13','39_14','39_15','39_16','40_2','40_3','40_4','40_5','40_6','40_7','40_8','40_9','40_11','40_12','40_13','40_14','40_15','40_16'],'themecd': {'Только CD вопросы без AB':152},}
	
		test.updateQuestList(0);
	},
	updateQuestList: function(showIndexMenu) {	
		$("#questList").empty();
		switch(showIndexMenu){

			case 0:
				test.selectButtonLabel("#btnBiletList","#panelRightInput .input-group-addon","bg-info"); 
				for(var i=1;i<41;i++) {
					$("#questList").append('<a class="btn btn-default nameTicket" style="width:47px;margin:3px;" href="javascript:;" data-id="'+i+'">'+i+'</a>');
				};
			break;		

			case 1:
				test.selectButtonLabel("#btnRNG","#panelRightInput .input-group-addon","bg-info"); 
				    $("#questList").append('<p>+5 вопросов за ошибку, на дополнительных вопросах ошибаться нельзя.</p>'
				);
			break;	

			case 2:			
				test.selectButtonLabel("#btnThemeList","#panelRightInput .input-group-addon","bg-info"); 
				var i = 1;
				$.each( test.mainDataArray['theme'+test.NameSet], function( key, value ) {
					$("#questList").append('<a class="list-group-item nameTheme" href="javascript:;" data-id="'+(i++)+'">'+key+'<small class="themesize text-muted"> -'+value+'</small></a>');
				});
			break;

			case 3:
				test.selectButtonLabel("#btnMarathon","#panelRightInput .input-group-addon","bg-info"); 
				$("#questList").append('<p>Попробуйте ответить на все 800 вопросов по порядку не прерываясь.</p>');				
			break;
		}
	},
	render: function(template,params) {
		var arr = [];
		switch(template){
			case 'questNumber': 
				arr = ["<div class='btn-group btn-page'><button id='ticket_",params.id,"' class='btn btn-default btnTicket' >",params.id+1,"</button></div>"];
			break;	
			
			case 'questControl': 
				arr = ["<div class='btn-group'><button class='btn btn-default ",params.className,"' >",params.text,"</button></div>"];
			break;

			case 'endButton': 
				arr = ["<div class='btn-group  btn-page'><button id='ticket_",params.id,"' class='btn btn-default btnTicket' >",params.ind,"</button></div>"];
			break;
			
			case 'quest': 
				arr = ["<div class='input-group'><span class='input-group-addon ' >Билет №",test.CurrentArray[test.CurrentQuest]['biletNumber'],", вопрос №",test.CurrentArray[test.CurrentQuest]['questNumber'],
						"</span> <span class='input-group-addon ' > ",test.typeTest,"</span> <span id='timer'  class='input-group-addon label-success'> ",
						test.getTimeString(),"<span id='iconControl' class='icon-pause'></span></span></div><img class='imageQuest' src='",test.statDir,"/img/",test.checkMainImage(test.CurrentArray[test.CurrentQuest]['image']),"'/>","<div class='btn-lg'>",test.CurrentArray[test.CurrentQuest]['quest'],
						"</div><div id='answer' class='list-group'></div><div id='panelTest' style='display:none;'> <div class='list-group-item'><div class='disc' >",
						test.checkImage(test.CurrentArray[test.CurrentQuest]['comments']),"</div></br> <button class='next list-group-item active'>Далее</button>"];  
  $( function() {
    $( "#panelTest" ).draggable();
  } );
			break;	
			
			case 'answer': 
				arr = ["<a href='javascript:;' class='answerText list-group-item' id='answer_",params.id,"'> ",params.id+1,'. ',params.textAnswer," </a>"];
			break;
			
			case 'end': 
				arr = ["<div id='endDiv' class='well text-center'><div id='endTextDiv'><h3 ><b>",params.textMessage,"</b></h3 ></div> <div id='mark'> Ошибок: <span class='label label-success'>",
						params.errors,"</span> Время:  <span class='label label-success'>",params.time,"</span> Режим: <span class='label label-info'>",test.typeTest,"</span></div></div>"];
			break;
			
		}
		
		return arr.join('');
		
	},
	loadTicket: function(typeData,questNum) {

		switch(typeData) {
			case 0:
				$.getJSON(test.statDir + '/quest/' +test.NameSet+'/bilet/b'+questNum+'.json', function( r ) {
					test.CurrentArray = r;
					test.shuffleQuestAll();
					test.start();
				});
				break;
					
			case 1:										
				$.getJSON(test.statDir + '/quest/' +test.NameSet+'/rng/r'+(Math.floor(Math.random() * (40)) + 1)+'.json', function( r ) {
					test.CurrentArray = r;
					test.shuffleQuestAll();
					test.start();
				});
				break;
				
			case 2:
				$.getJSON(test.statDir + '/quest/' +test.NameSet+'/theme/'+questNum+'.json', function( r ) {
					test.CurrentArray = r;
					test.shuffleQuestAll();
					test.start();
				});
				break;

			case 3:										
				$.getJSON(test.statDir + '/quest/' +test.NameSet+'/800.json', function( r ) {
					test.CurrentArray = r;
					test.shuffleQuestAll();
					test.start();
				});
				break;

		}
	},
	start: function() {
		$("#btnBilet").empty();
		test.countQuest = 0;
		test.countWrongAnswer = 0;
		test.CurrentQuest = 0;
		test.Pass = true;
		test.Answers = new Array(test.CurrentArray.length + 12).join('0').split('').map(parseFloat);

		test.addQuestControl({text: "&lt", className: "pagination-prev"});
		test.addQuestControl({text: "&gt", className: "pagination-next"});

		for(var i=0;i<test.CurrentArray.length;i++)
			test.addQuest({id: test.countQuest});

		test.myPagination.reLoad(1);

		$(".btnTicket").first().trigger( "click" );	
		test.startTimer();
	},
	addQuest: function(params) {	
		$("#btnBilet .btn-group:last").before(test.render('questNumber',params));	
		test.countQuest++;		
	},
	addQuestControl: function(params) {	
		$("#btnBilet").append(test.render('questControl',params));					
	},
	compareRandom: function(a, b){
		return Math.random() - 0.5;
	},
	addMoreQuest: function(questNum) {		
		$.getJSON( test.statDir + '/quest/' +test.NameSet+'/sets/set'+(questNum+1)+'.json', function( r ) {			
			r.sort(test.compareRandom);
			for(var i=0;i<5;i++){
				test.CurrentArray.push(r[i]);
				test.shuffleQuest(test.countQuest);
				test.addQuest({id:test.countQuest});
			}
			test.myPagination.reLoad(0);
		});	
	},
	cleanArray: function(actual) {
		var j=0;
		var newArray = new Array();		
		newArray["sv"] = new Array();
		newArray["index"] = new Array();
		
		for (var i = 0; i < actual.length; i++) {
		  if (actual[i]) {
			newArray["sv"].push(actual[i]);
			newArray["index"].push(j++);
		  }
		}
		test.shuffleArray(newArray,'sv','index');
		newArray['index'] = test.invertKeyValue(newArray['index']);
		delete actual; 
		return newArray;
	},
	shuffleArray: function(a,name1,name2) {
		var j, x1,x2, i;
		for (i = a[name1].length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x1 = a[name1][i];
			x2 = a[name2][i];

			a[name1][i] = a[name1][j];
			a[name2][i] = a[name2][j];

			a[name1][j] = x1;
			a[name2][j] = x2;
		}		
	},
	invertKeyValue: function(a)
	{
		var newArray = new Array();

		for(var i=0;i<a.length;i++) {
			newArray[a[i]] = i;
		}

		delete a;
		return newArray;
	},
	shuffleQuest: function(indexQuest) {						
		test.CurrentArray[indexQuest]['v'] = test.cleanArray(test.CurrentArray[indexQuest]['v']);		
		test.CurrentArray[indexQuest]['otvet'] = test.CurrentArray[indexQuest]['v']['index'][test.CurrentArray[indexQuest]['otvet']-1];
	},
	shuffleQuestAll: function() {
		for(var i=0;i<test.CurrentArray.length;i++) {
			test.shuffleQuest(i);
		}
	},
	showQuest: function() {
		$("#ticketView").append(test.render('quest',-1));
		for(var i=0;i<test.CurrentArray[test.CurrentQuest]['v']['sv'].length;i++) {
			$("#answer").append(test.render('answer',{ id: i, textAnswer: test.CurrentArray[test.CurrentQuest]['v']['sv'][i] }));
		}
	},
	checkTestEnd: function() {	
	
		for(var i=0;i<test.countQuest;i++) {
				if (test.Answers[i] == 0) return false;
			}	
		return true;
	},
	addEndTest: function(correctAnswer) {	
		clearTimeout(test.timerId);
		$("#btnBilet .btn-group:last").before(test.render('endButton',{id: -1, ind: '='}));		
		test.myPagination.reLoad(0);
		if (correctAnswer) {
			test.myPagination.setVesiblePage(test.CurrentQuest+1);
			$(".btnTicket").last().trigger( "click" );
		}
	},
	showEnd: function() {	
		var time = $("#timer").text();
		$("#ticketView").empty();
		if (test.countWrongAnswer>2 || test.Pass == false) $("#ticketView").append(test.render('end',{textMessage: "К сожалению, Вы не прошли экзамен.", errors: test.countWrongAnswer,time:time}));
		else $("#ticketView").append(test.render('end',{textMessage: "Поздравляем! Вы прошли экзамен.", errors: test.countWrongAnswer,time:time}));
	},
	addSecond: function () {
		if (test.pause) 
			$("#timer").html(test.getTimeString()+"<span id='iconControl' class='icon-play'>");
		else 
		{
			test.seconds++;
			if (test.seconds >= 60) {
				test.seconds = 0;
				test.minutes++;
				if (test.minutes >= 60) {
					test.minutes = 0;
				}
			}
			$("#timer").html(test.getTimeString()+"<span id='iconControl' class='icon-pause'>");
		}
		test.timerId = setTimeout(test.addSecond, 1000);
	},
	getTimeString: function () {
		return (test.minutes ? (test.minutes > 9 ? test.minutes : "0" + test.minutes) : "00") + ":" + (test.seconds > 9 ? test.seconds : "0" + test.seconds);
	},
	startTimer: function () {
		test.pause = false;	
		test.seconds = 0;
		test.minutes = 0;	
		if (test.timerId>0) clearTimeout(test.timerId);
		$("#timer").html(test.getTimeString()+"<span id='iconControl' class='icon-pause'>");
		test.timerId = setTimeout(test.addSecond, 1000);
	},
	checkImage: function (text) {
		text = text.replace(new RegExp('(\u0440\u0430\u0437\u043C\u0435\u0442\u043A\\S*) (\\d+\\.\\d+\\.?\\d*)','gi'), "$1 $2 <img class='imageDisc' src='"+test.statDir+"/img/markings/rm$2.png' />");
		
		text = text.replace(new RegExp('(\u0437\u043D\u0430\u043A\\S*) ((\\d+)\\.\\d+\\.?\\d*)','gi'), "$1 $2 <img class='imageDisc' src='"+test.statDir+"/img/sign/z$2.png' />");
		
		text = text.replace(new RegExp('(\u0442\u0430\u0431\u043B\u0438\u0447\u043A\\S*) ((\\d+)\\.\\d+\\.?\\d*)','gi'), "$1 $2 <img class='imageDisc' src='"+test.statDir+"/img/sign/z$2.png' />");

		text = text.replace(new RegExp('\\[((\\d+)\\.\\d+\\.?\\d*)\\]','gi'), "$1 <img class='imageDisc' src='"+test.statDir+"/img/sign/z$1.png' />");
		return text;				
	},
	checkMainImage: function (text) {		
		var keyImage = test.CurrentArray[test.CurrentQuest]['biletNumber'] + '_' + test.CurrentArray[test.CurrentQuest]['questNumber'];
		
		if (test.CurrentArray[test.CurrentQuest]['realUrl'] != null) {
			if(test.NameSet == 'cd' && test.mainDataArray['cd'].includes(keyImage)) {
				return 'cd/'+keyImage+'.webp';
			} else if(test.mainDataArray['ab'].includes(keyImage)) {
				return 'ab/'+keyImage+'.webp';
			}
		}	
		
		return "noimg.png";
	}
};