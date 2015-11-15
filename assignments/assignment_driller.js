//find source op count
//find data types
//find op type based on data type
//devise formula
//find result

var difficulty = 0;
var min_number = 0;
var max_number = 50;
var source_words=["hello","goodbye","konichiwa","hola","adios","kitties","puppies","fish","foo","bar"];
var assignment_types=["increment","decrement","assign","concatenate"];
var data_types = [
  {
    type:'string',
    allowed_ops: ['concat', 'assign']
  },
  {
    type:'number',
    allowed_ops: ['add','mult','div','sub','assign']
  }];
var initial_op_types = {
  'assign':{
    name: 'assign',
    long_name: 'assignment',
    operator: '='
  }
};

var op_types = {
  'concat':{
    name: 'concat',
    long_name: 'concatenate',
    operator: '+',
    allowed_1st_datatypes: ['string'],
    allowed_2nd_datatypes: ['string','number']
  },
  'add':{
    name: 'add',
    long_name: 'addition',
   operator: '+',
    allowed_1st_datatypes: ['number'],
    allowed_2nd_datatypes: ['number']
  },
  'mult':{
    name: 'mult',
    long_name: 'multiplication',
   operator: '*',
    allowed_1st_datatypes: ['number'],
    allowed_2nd_datatypes: ['number']
  },
  'div':{
    name: 'div',
    long_name: 'division',
   operator: '/',
    allowed_1st_datatypes: ['number'],
    allowed_2nd_datatypes: ['number']
  },
  'sub':{
    name:'sub',
    long_name: 'subtraction',
   operator: '-',
    allowed_1st_datatypes: ['number'],
    allowed_2nd_datatypes: ['number']
  },
  'inc':{
    name: 'inc',
    long_name: 'increment',
    operator: '++',
    allowed_1st_datatypes: ['number'],
    allowed_2nd_datatypes: []
  },
  'dec':{
    name: 'dec',
    long_name: 'decrement',
    operator: '--',
    allowed_1st_datatypes: ['number'],
    allowed_2nd_datatypes: []
  },
  
};
var op_types_array=[];

for(var i in op_types){
  op_types_array.push(op_types[i]);
}

function get_letter(n){
  c = String.fromCharCode(97 + n);
  return c;
}

//pass in a min and max for a number, or an array to get a random element
function get_random(min,max){
  var return_array_element = false;
  var the_array=null;
  if(Array.isArray(min)){
    return_array_element = true;
    the_array = min;
    min = 0;
    max = the_array.length-1;
  }
  var n = Math.floor(Math.random()*(max+1-min))+min;
  if(return_array_element){
    var element = the_array[n];
    return element;
  }
  else{
    return n;
  }
  
}
function assign_string(){
  return source_words[get_random(0,source_words.length-1)];
}
function print_entities(entities){
  console.log('**************','processing: ',entities[0]);
  var left_entity_part = entities[0].variable_name;
  var equals_part =  entities[0].this_op.operator+(entities[0].subop!==null ? entities[0].subop : '');
  var right_entity_part = '';
  for(var i = 1; i<entities.length; i++){
    console.log('**************','processing: ',entities[i]);
    right_entity_part+=entities[i].this_op.operator;
    if(entities[i].type=='literal'){
      right_entity_part+=entities[i].value;
    }
    else{
      right_entity_part+=entities[i].variable_name;
    }
  }
  return (left_entity_part + equals_part + right_entity_part);
}
var value_entity = function(op, position){
  var self = this;
  self.value = null;
  self.variable = null;
  self.nearby_ops = [];
  self.add_op = function(){
    self.nearby_ops.push(op);
  }
  self.determine_value = function(position){
    
    if(get_random(0,100)<50){
      self.value = assign_string();
    } else{
      self.value = get_random(min_number, max_number);
    }
    
    if(get_random(0,100)<(25+difficulty*3)){
      self.variable = get_letter(get_random(0,25));
    }
  };
  self.init = function(op, position){
    self.add_op(op);
    self.determine_value(position);
  }
  self.init(op);
  return self;
};
var assignment_entity = function(container, index){
  var self = this;
  self.container = container;
  self.index = index;
  self.op = null;
  self.operands = [];
  self.assign_operands = function(){
    if(self.index===0){
      self.operands[0]= new value_entity(self.op,0);
      self.operands[0].determine_value();
    }
    else{
      self.operands[0]=self.container[self.index-1].get_second_operand();
    }
    self.operands[1]= new value_entity(self.op,1);
    self.operands[1].determine_value();
  };
  self.assign_operator = function(){
    console.log('op types: ',op_types_array);
    self.op=get_random(op_types_array);
  };
  self.get_second_operand = function(){
    return self.operands[1];
  };
  self.init = function(){
    self.assign_operator();
    self.assign_operands();
  }
  self.init();
  return self;
};

function generate_assignment(){
  var num_entities = get_random(1,1);
  var entities = [];
  var assignment_var=get_letter(get_random(0,25));
  // var obj = new assignment_entity();
  // if(get_random(0,100)<50+(difficulty*3)){
  //   assignment_type = get_random(op_types);
  // }
  // else{
  //   assignment_type = initial_op_types[0];
  // }
  for(var i = 0; i<num_entities; i++){
    obj = new assignment_entity(entities,i);
    entities.push(obj);
  }

  return entities;
}


var entities = generate_assignment();
/*for(var i=0; i<entities.length; i++){
  console.log('*************************','entity '+i,entities[i]);
}*/
console.log(entities);
