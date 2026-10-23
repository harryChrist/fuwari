---
title: "O Básico em 7 Linguagens: Variáveis, Loops, Funções e Classes"
published: 2026-10-23
description: "Go, JavaScript, Python, Lua, C, C# e Dart lado a lado: como cada uma trata variáveis, condicionais, loops, funções e classes — e como pensar ao escrever código em cada uma."
image: ""
tags: [Go, JavaScript, Python, Lua, C, CSharp, Dart, Fundamentals]
category: "Desenvolvimento"
draft: false
---

Quem já passou por várias linguagens conhece a sensação: você sabe *o que* quer fazer, mas trava em *como* aquela linguagem quer que você faça. O `for` do Lua começa no 1. O `for...in` do JavaScript não percorre o que você acha que percorre. O C deixa você ler lixo de memória sem reclamar.

A boa notícia é que os conceitos são os mesmos em todo lugar. Variável, condição, repetição, função e algum jeito de agrupar dados com comportamento. O que muda são as **decisões de design** de cada linguagem — e, quando você entende essas decisões, fica fácil trocar de uma para outra.

Este post coloca sete linguagens lado a lado — **Go, JavaScript, Python, Lua, C, C# e Dart** — conceito por conceito.

---

## O mapa antes do território

Quase todo comportamento "estranho" de uma linguagem se explica por três perguntas:

1. **Os tipos são checados antes de rodar (estático) ou durante (dinâmico)?** Isso decide se o erro aparece no seu editor ou na cara do usuário.
2. **Quem cuida da memória?** Você (C) ou um *Garbage Collector* (todas as outras).
3. **Como o código roda?** Compilado para código de máquina, compilado para uma máquina virtual ou interpretado.

| Linguagem | Tipagem | Memória | Execução | Onde brilha |
| :--- | :--- | :--- | :--- | :--- |
| **Go** | Estática | GC | Binário nativo | Backend, CLIs, infraestrutura |
| **JavaScript** | Dinâmica | GC | JIT (V8, etc.) | Web, Node.js |
| **Python** | Dinâmica | GC (contagem de referências) | Interpretado (bytecode) | Scripts, dados, IA, automação |
| **Lua** | Dinâmica | GC | Interpretado (VM enxuta) | Embutida em jogos e apps (Roblox, Neovim, LÖVE) |
| **C** | Estática (fraca) | **Manual** | Binário nativo | Sistemas, embarcados, drivers |
| **C#** | Estática | GC | .NET (JIT/AOT) | Apps corporativos, Unity, APIs |
| **Dart** | Estática + *null safety* | GC | JIT no dev, AOT em produção | Flutter (mobile, desktop, web) |

Guarde essa tabela. Ela vai explicar quase tudo daqui pra frente.

---

## 1. Variáveis

Uma variável é um nome que aponta para um valor. As perguntas que importam são: **preciso declarar o tipo?**, **posso reatribuir?** e **o que tem dentro se eu não inicializar?**

```go title="variaveis.go"
var idade int = 30      // tipo explícito
nome := "Ana"           // tipo inferido (só dentro de funções)
const Pi = 3.14         // constante de compilação
var contador int        // sem valor: recebe o zero value (0)
```

```js title="variaveis.js"
let idade = 30;         // pode reatribuir
const nome = "Ana";     // não pode reatribuir
var antigo = true;      // evite: escopo de função e hoisting
let vazio;              // undefined
```

```python title="variaveis.py"
idade = 30              # não existe declaração: atribuir cria a variável
nome: str = "Ana"       # type hint (documentação, não é checado ao rodar)
PI = 3.14               # "constante" por convenção (MAIÚSCULAS), nada impede mudar
```

```lua title="variaveis.lua"
local idade = 30        -- sempre use local
nome = "Ana"            -- sem local vira GLOBAL (quase sempre um bug)
local vazio             -- nil
```

```c title="variaveis.c"
int idade = 30;
const double PI = 3.14;
char nome[] = "Ana";    // string é um array de char terminado em '\0'
int lixo;               // variável local sem valor: conteúdo indefinido!
```

```csharp title="Variaveis.cs"
int idade = 30;
var nome = "Ana";       // inferido, mas continua sendo string para sempre
const double Pi = 3.14;
int semValor;           // ler antes de atribuir é erro de compilação
```

```dart title="variaveis.dart"
var idade = 30;               // inferido como int
final nome = 'Ana';           // atribuído uma vez, em tempo de execução
const pi = 3.14;              // constante de compilação
String? apelido;              // o "?" permite null; sem ele, null não entra
late String carregadoDepois;  // "prometo inicializar antes de usar"
```

### O que tem dentro de uma variável não inicializada?

Essa é uma das diferenças mais reveladoras entre as linguagens, porque mostra o quanto cada uma confia em você:

| Linguagem | Variável declarada sem valor |
| :--- | :--- |
| **Go** | *Zero value* garantido: `0`, `""`, `false`, `nil` |
| **JavaScript** | `undefined` |
| **Python** | Não existe — usar antes de atribuir gera `NameError` |
| **Lua** | `nil` (inclusive para variáveis que nunca existiram) |
| **C** | **Lixo de memória** em variáveis locais; ler é comportamento indefinido |
| **C#** | Local: erro de compilação. Campo de classe: valor padrão (`0`, `null`) |
| **Dart** | Tipo anulável: `null`. Não anulável: o compilador obriga a inicializar |

O C confia totalmente em você; o C# e o Dart não confiam nada e checam tudo na compilação; o Go resolve com um valor padrão previsível.

:::warning
Em Lua, qualquer variável sem `local` vira global — e um nome digitado errado não dá erro, só retorna `nil`. Em JavaScript, `var` tem escopo de função (não de bloco) e é "içado" (*hoisting*) para o topo. Nas duas linguagens, a regra prática é a mesma: **declare tudo com `local` / `const` / `let`**.
:::

### `const` não significa imutável

Uma confusão comum: `const` em JavaScript, `final` em Dart e `readonly` em C# impedem que você **reatribua a variável**, mas não impedem que você **altere o objeto** para o qual ela aponta.

```js title="const.js"
const lista = [1, 2, 3];
lista.push(4);      // ok: o array mudou, a variável não
lista = [];         // TypeError: Assignment to constant variable
```

### Atribuir copia o valor ou compartilha?

Essa é a pergunta que mais evita bugs quando você troca de linguagem. Quando você faz `b = a` e depois altera `b`, o `a` muda junto?

- **Tipos simples** (números, booleanos) são sempre copiados, em todas as sete.
- **Objetos, listas e tabelas** em **JavaScript, Python, Lua e Dart** são compartilhados: `b = a` copia só a *referência*, e as duas variáveis apontam para o mesmo objeto.
- **C** copia tudo, inclusive `struct`s inteiras. Para compartilhar, você usa ponteiros explicitamente.
- **Go** copia `struct`s e arrays, mas *slices* e *maps* carregam uma referência por dentro — copiar um slice compartilha os mesmos dados.
- **C#** divide os tipos em dois mundos: `struct` é copiado, `class` é compartilhada.

```python title="referencia.py"
a = [1, 2, 3]
b = a
b.append(4)
print(a)  # [1, 2, 3, 4] -- a e b são a mesma lista

c = a.copy()  # para ter uma cópia de verdade, peça uma
```

---

## 2. Condicionais e o que conta como "verdadeiro"

A sintaxe do `if` é quase igual em todas. O que muda — e causa bugs silenciosos — é **o que a linguagem aceita como condição**.

| Linguagem | O que é considerado falso |
| :--- | :--- |
| **Go, C#, Dart** | Só aceitam `bool`. `if (1)` nem compila |
| **C** | `0` e ponteiro nulo. Qualquer outro número é verdadeiro |
| **JavaScript** | `false`, `0`, `""`, `null`, `undefined`, `NaN` (mas `[]` e `{}` são **verdadeiros**) |
| **Python** | `False`, `None`, `0`, `""` e coleções vazias (`[]`, `{}`) |
| **Lua** | **Só `false` e `nil`**. `0` e `""` são verdadeiros |

```lua title="verdade.lua"
if 0 then print("em Lua, 0 é verdadeiro!") end

local lista = {}
if #lista == 0 then print("vazia") end  -- teste o tamanho explicitamente
```

Quem vem de Python e escreve `if lista:` em JavaScript tem uma surpresa: um array vazio é verdadeiro lá. Na dúvida, compare explicitamente (`lista.length === 0`, `#t == 0`, `len(s) == 0`).

:::tip
Em JavaScript, use sempre `===` em vez de `==`. O `==` converte tipos antes de comparar, e daí saem pérolas como `"0" == false` sendo `true`. Lua, por sua vez, usa `~=` para "diferente", não `!=`.
:::

---

## 3. Loops

Todo loop responde a uma de três necessidades: **repetir N vezes**, **percorrer uma coleção** ou **repetir enquanto uma condição for verdadeira**. Cada linguagem tem uma forma preferida para cada uma.

```go title="loops.go"
// Go só tem uma palavra-chave para loops: for
for i := 0; i < 5; i++ { }          // clássico
for i := range 5 { }                // Go 1.22+: de 0 a 4

frutas := []string{"maçã", "uva"}
for i, fruta := range frutas { }    // índice e valor

for condicao { }                    // é o "while" do Go
```

```js title="loops.js"
for (let i = 0; i < 5; i++) { }

const frutas = ["maçã", "uva"];
for (const fruta of frutas) { }     // of = valores
for (const i in frutas) { }         // in = CHAVES ("0", "1"), como strings
frutas.forEach((fruta, i) => { });

while (condicao) { }
```

```python title="loops.py"
for i in range(5):                  # 0 a 4
    pass

frutas = ["maçã", "uva"]
for fruta in frutas:
    pass
for i, fruta in enumerate(frutas):  # índice e valor
    pass

while condicao:
    pass
```

```lua title="loops.lua"
for i = 1, 5 do end                 -- de 1 a 5, INCLUSIVO

local frutas = {"maçã", "uva"}
for i, fruta in ipairs(frutas) do   -- listas (começa em 1)
end
for chave, valor in pairs(tabela) do  -- qualquer tabela, sem ordem garantida
end

while condicao do end
repeat until condicao               -- executa ao menos uma vez
```

```c title="loops.c"
for (int i = 0; i < 5; i++) { }

int numeros[] = {10, 20, 30};
int tamanho = sizeof(numeros) / sizeof(numeros[0]);
for (int i = 0; i < tamanho; i++) { }  // não há foreach: o array não sabe o próprio tamanho

while (condicao) { }
do { } while (condicao);
```

```csharp title="Loops.cs"
for (int i = 0; i < 5; i++) { }

var frutas = new List<string> { "maçã", "uva" };
foreach (var fruta in frutas) { }

while (condicao) { }
do { } while (condicao);
```

```dart title="loops.dart"
for (var i = 0; i < 5; i++) {}

final frutas = ['maçã', 'uva'];
for (final fruta in frutas) {}
frutas.forEach((fruta) {});

while (condicao) {}
do {} while (condicao);
```

Três pegadinhas para guardar:

- **Lua começa em 1** e o `for` numérico **inclui** o limite final. `for i = 1, #lista` percorre a lista inteira.
- **`for...in` em JavaScript** percorre as chaves, não os valores. Para arrays, use `for...of`.
- **C não sabe o tamanho de um array** depois que ele é passado para uma função (vira um ponteiro). Por isso funções em C quase sempre recebem o array *e* o tamanho.

:::note
Em Python e Lua, nem sempre você precisa de um loop explícito. *List comprehensions* (`[x * 2 for x in numeros if x > 0]`) em Python e `map`/`filter` em JavaScript, Dart e C# (via LINQ) costumam deixar a intenção mais clara do que um `for` com `if` dentro.
:::

---

## 4. Funções

Uma função recebe entradas, faz um trabalho e devolve um resultado. As diferenças estão em **quantos valores ela pode devolver**, **como lidar com parâmetros opcionais** e **como ela sinaliza um erro**.

Para comparar, a mesma função nas sete linguagens: dividir dois números, tratando a divisão por zero.

```go title="funcoes.go"
func dividir(a, b float64) (float64, error) {
	if b == 0 {
		return 0, errors.New("divisão por zero")
	}
	return a / b, nil
}

resultado, err := dividir(10, 2)
if err != nil {
	log.Fatal(err)
}
```

```js title="funcoes.js"
function dividir(a, b) {
  if (b === 0) throw new Error("divisão por zero");
  return a / b;
}

const dobrar = (x) => x * 2;              // arrow function
const saudar = (nome = "visitante") => `Olá, ${nome}`;  // parâmetro padrão

try {
  dividir(10, 0);
} catch (e) {
  console.error(e.message);
}
```

```python title="funcoes.py"
def dividir(a: float, b: float) -> float:
    if b == 0:
        raise ValueError("divisão por zero")
    return a / b

def saudar(nome="visitante", *, formal=False):  # após *, só por nome
    return f"Prezado {nome}" if formal else f"Olá, {nome}"

saudar("Ana", formal=True)

try:
    dividir(10, 0)
except ValueError as e:
    print(e)
```

```lua title="funcoes.lua"
local function dividir(a, b)
  if b == 0 then
    return nil, "divisão por zero"   -- múltiplos retornos, como em Go
  end
  return a / b
end

local function saudar(nome)
  nome = nome or "visitante"         -- o jeito Lua de ter parâmetro padrão
  return "Olá, " .. nome             -- .. concatena strings
end

local resultado, erro = dividir(10, 0)
if not resultado then print(erro) end
```

```c title="funcoes.c"
// Retorna 0 em sucesso e -1 em erro; o resultado sai pelo ponteiro
int dividir(double a, double b, double *resultado) {
    if (b == 0) {
        return -1;
    }
    *resultado = a / b;
    return 0;
}

double r;
if (dividir(10, 2, &r) != 0) {
    fprintf(stderr, "divisão por zero\n");
}
```

```csharp title="Funcoes.cs"
static double Dividir(double a, double b)
{
    if (b == 0) throw new DivideByZeroException();
    return a / b;
}

static string Saudar(string nome = "visitante") => $"Olá, {nome}";

static (int min, int max) Extremos(int[] xs) => (xs.Min(), xs.Max());  // tupla

Func<int, int> dobrar = x => x * 2;  // lambda
```

```dart title="funcoes.dart"
double dividir(double a, double b) {
  if (b == 0) throw ArgumentError('divisão por zero');
  return a / b;
}

int dobrar(int x) => x * 2;  // corpo de uma expressão só

// Parâmetros nomeados ficam entre chaves
String saudar({required String nome, bool formal = false}) =>
    formal ? 'Prezado $nome' : 'Olá, $nome';

saudar(nome: 'Ana', formal: true);
```

### Duas filosofias de erro

Repare que as linguagens se dividem em dois grupos:

- **Erro como valor de retorno** — Go, Lua e C. O erro é só mais um valor que a função devolve, e quem chama é obrigado a olhar para ele. É mais verboso, mas o caminho do erro fica visível no código.
- **Exceções** — JavaScript, Python, C# e Dart. A função "lança" o erro, e ele sobe pela pilha até alguém capturar com `try/catch`. O código fica mais limpo, mas qualquer linha pode, em tese, interromper o fluxo.

Nenhuma é melhor em absoluto. O que importa é **seguir a convenção da linguagem**: lançar exceção em Go ou ignorar o código de retorno em C são os erros mais comuns de quem está chegando.

### Funções como valores

Em todas, exceto C, funções são valores: dá para guardar numa variável, passar como argumento e criar *closures* — funções que "lembram" das variáveis do lugar onde nasceram.

```js title="closure.js"
function criarContador() {
  let total = 0;
  return () => ++total;  // a função interna guarda acesso a "total"
}

const proximo = criarContador();
proximo(); // 1
proximo(); // 2
```

O mesmo padrão funciona em Go, Python (com `nonlocal`), Lua, C# e Dart. Em C, o máximo que existe são ponteiros para função, sem captura de variáveis.

:::caution[Armadilha do Python]
Valores padrão de parâmetros são criados **uma única vez**, quando a função é definida. Por isso `def adicionar(item, lista=[])` acumula itens entre chamadas. Use `lista=None` e crie a lista dentro da função.
:::

---

## 5. Classes (e o que faz o papel delas)

Classe é o jeito de juntar **dados** e **comportamento** num lugar só. Aqui as linguagens divergem bastante: algumas têm classes completas, outras simulam com o que têm, e duas simplesmente não têm.

O exemplo é o mesmo em todas: uma conta bancária com titular, saldo protegido e um método para depositar.

```go title="conta.go"
// Go não tem classes: tem structs com métodos
type Conta struct {
	Titular string   // maiúscula = público
	saldo   float64  // minúscula = privado ao pacote
}

func NovaConta(titular string) *Conta {  // "construtor" é só uma função
	return &Conta{Titular: titular}
}

// (c *Conta) é o receptor: o equivalente ao this/self
func (c *Conta) Depositar(valor float64) error {
	if valor <= 0 {
		return errors.New("valor inválido")
	}
	c.saldo += valor
	return nil
}

func (c *Conta) Saldo() float64 { return c.saldo }
```

```js title="conta.js"
class Conta {
  #saldo = 0;  // # = privado de verdade

  constructor(titular) {
    this.titular = titular;
  }

  depositar(valor) {
    if (valor <= 0) throw new Error("valor inválido");
    this.#saldo += valor;
  }

  get saldo() {
    return this.#saldo;
  }
}

const c = new Conta("Ana");
c.depositar(100);
console.log(c.saldo); // 100
```

```python title="conta.py"
class Conta:
    def __init__(self, titular: str):
        self.titular = titular
        self._saldo = 0.0  # _ = "privado" por convenção

    def depositar(self, valor: float) -> None:
        if valor <= 0:
            raise ValueError("valor inválido")
        self._saldo += valor

    @property
    def saldo(self) -> float:
        return self._saldo

c = Conta("Ana")
c.depositar(100)
print(c.saldo)  # 100.0
```

```lua title="conta.lua"
-- Lua não tem classes: tem tabelas e metatables
local Conta = {}
Conta.__index = Conta  -- métodos não achados no objeto são buscados em Conta

function Conta.new(titular)
  local self = setmetatable({}, Conta)
  self.titular = titular
  self.saldo = 0
  return self
end

-- O ":" passa o próprio objeto como primeiro argumento (self)
function Conta:depositar(valor)
  if valor <= 0 then error("valor inválido") end
  self.saldo = self.saldo + valor
end

local c = Conta.new("Ana")
c:depositar(100)
print(c.saldo)  -- 100
```

```c title="conta.c"
// C não tem classes nem métodos: tem structs e funções que recebem ponteiros
typedef struct {
    char titular[50];
    double saldo;
} Conta;

void conta_iniciar(Conta *c, const char *titular) {
    snprintf(c->titular, sizeof c->titular, "%s", titular);
    c->saldo = 0;
}

int conta_depositar(Conta *c, double valor) {
    if (valor <= 0) return -1;
    c->saldo += valor;
    return 0;
}

Conta c;
conta_iniciar(&c, "Ana");
conta_depositar(&c, 100);
printf("%.2f\n", c.saldo);  // 100.00
```

```csharp title="Conta.cs"
public class Conta
{
    public string Titular { get; }
    public decimal Saldo { get; private set; }  // leitura pública, escrita privada

    public Conta(string titular) => Titular = titular;

    public void Depositar(decimal valor)
    {
        if (valor <= 0) throw new ArgumentException("valor inválido");
        Saldo += valor;
    }
}

var c = new Conta("Ana");
c.Depositar(100);
Console.WriteLine(c.Saldo); // 100
```

```dart title="conta.dart"
class Conta {
  final String titular;
  double _saldo = 0;  // _ = privado à biblioteca (arquivo)

  Conta(this.titular);  // atalho: atribui o parâmetro direto ao campo

  double get saldo => _saldo;

  void depositar(double valor) {
    if (valor <= 0) throw ArgumentError('valor inválido');
    _saldo += valor;
  }
}

final c = Conta('Ana');  // sem "new"
c.depositar(100);
print(c.saldo); // 100.0
```

O que dá para tirar dessa comparação:

- **Por baixo, é tudo a mesma coisa.** O método do C (`conta_depositar(&c, 100)`) e o do Lua (`c:depositar(100)`) mostram o que as outras escondem: um método é só uma função que recebe o objeto como primeiro parâmetro. `this`, `self` e o receptor do Go são esse parâmetro.
- **Privacidade varia de "garantida" a "por favor".** C# e JavaScript (`#`) bloqueiam de verdade. Go e Dart controlam por pacote/arquivo. Python e Lua confiam na convenção — o `_` é um aviso, não um cadeado.
- **`this` em JavaScript é traiçoeiro.** Ele depende de *como* a função é chamada, não de onde foi definida. Passar `c.depositar` como callback perde o `this`. Arrow functions ou `.bind(this)` resolvem.

:::tip
Para dinheiro de verdade, não use `float`/`double`: `0.1 + 0.2` não dá exatamente `0.3` em nenhuma dessas linguagens. O C# tem `decimal`, Python tem o módulo `decimal`, e nas outras o padrão é guardar centavos como inteiro.
:::

### Herança, composição e interfaces

| Linguagem | Herança | Interfaces / contratos |
| :--- | :--- | :--- |
| **Go** | Não existe. Usa *embedding* (composição) | Implícitas: implementou os métodos, satisfez a interface |
| **JavaScript** | `extends` (sobre protótipos) | *Duck typing*: se tem o método, serve |
| **Python** | Sim, inclusive múltipla | *Duck typing*; `Protocol` e `ABC` para formalizar |
| **Lua** | Encadeando metatables | *Duck typing* |
| **C** | Não existe | Structs com ponteiros para função, na mão |
| **C#** | Simples (`: Base`) | Explícitas: `class X : IInterface` |
| **Dart** | `extends` + `mixin` | Toda classe já é uma interface (`implements`) |

A tendência das linguagens mais novas (Go e, em boa parte, Dart com mixins) é preferir **composição a herança**: em vez de "um `Gerente` é um `Funcionario`", pensar "um `Gerente` *tem* as capacidades de que precisa". Hierarquias profundas de herança ficam frágeis rápido, em qualquer linguagem.

---

## 6. Como pensar em cada linguagem

Saber a sintaxe é a metade fácil. A outra metade é escrever código do jeito que a linguagem espera — o famoso código **idiomático**.

**Go: seja explícito e chato.** Go prefere código óbvio a código esperto. Trate cada `err` logo depois da chamada, prefira structs pequenas e interfaces de um ou dois métodos, e não tente recriar herança. Se parece repetitivo, provavelmente está certo.

**JavaScript: pense em eventos e assincronia.** Quase tudo em JS é assíncrono (requisições, timers, cliques), então `async/await` e Promises são o pão de cada dia. Use `const` por padrão, `let` quando precisar reatribuir, nunca `var`, e `===` sempre. Se o projeto crescer, TypeScript resolve a maior fraqueza da linguagem: a falta de tipos.

**Python: legibilidade acima de tudo.** O lema é "deve haver um jeito óbvio de fazer". Use *comprehensions*, `enumerate`, `with` para arquivos e a enorme biblioteca padrão antes de escrever algo do zero. *Type hints* não são obrigatórios, mas com uma ferramenta como mypy ou Pyright pegam muitos bugs antes de rodar.

**Lua: tabela é tudo.** Lista, dicionário, objeto, módulo — é tudo tabela. Lua é pequena de propósito, feita para ser embutida em outro programa, então o "jeito Lua" depende muito do ambiente (Roblox, Neovim, LÖVE). Regras de ouro: `local` em tudo, índices começam em 1, e só `nil` e `false` são falsos.

**C: você é o gerente da memória.** Para cada `malloc` deve existir um `free`, e para cada array você precisa saber o tamanho. Pense em bytes e endereços: o que é cópia, o que é ponteiro, quem é dono de cada pedaço de memória. Compile sempre com `-Wall -Wextra` — os avisos do compilador são seus melhores amigos.

**C#: tipos fortes e o ecossistema a seu favor.** C# é a mais "completa" das sete: classes, interfaces, propriedades, generics, LINQ, `async/await`. Pense em contratos (interfaces) e deixe o compilador trabalhar. Para manipular coleções, LINQ (`Where`, `Select`, `OrderBy`) costuma substituir loops inteiros.

**Dart: tudo é objeto, inclusive a interface.** No Flutter, cada pedaço de tela é uma classe (um *widget*), e a interface é uma árvore desses objetos. Aproveite o *null safety*: se o tipo não tem `?`, ele nunca é `null`, e o compilador garante isso. Prefira `final` por padrão e parâmetros nomeados em construtores com muitos campos.

---

## Resumo: a cola para consultar

| | Go | JavaScript | Python | Lua | C | C# | Dart |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Variável** | `x := 1` | `let x = 1` | `x = 1` | `local x = 1` | `int x = 1;` | `var x = 1;` | `var x = 1;` |
| **Constante** | `const` | `const` | convenção | `<const>` (5.4) | `const` | `const` | `const` / `final` |
| **Nulo** | `nil` | `null` / `undefined` | `None` | `nil` | `NULL` | `null` | `null` |
| **Diferente** | `!=` | `!==` | `!=` | `~=` | `!=` | `!=` | `!=` |
| **Percorrer lista** | `range` | `for...of` | `for in` | `ipairs` | índice | `foreach` | `for in` |
| **Primeiro índice** | 0 | 0 | 0 | **1** | 0 | 0 | 0 |
| **Erros** | retorno `error` | exceção | exceção | retorno / `error()` | código de retorno | exceção | exceção |
| **Classes** | struct + métodos | `class` | `class` | metatables | struct + funções | `class` | `class` |
| **Bloco** | `{ }` | `{ }` | indentação | `do ... end` | `{ }` | `{ }` | `{ }` |

No fim das contas, aprender a sétima linguagem é muito mais rápido do que aprender a primeira. Os conceitos se repetem; o que você precisa reaprender são as decisões de design. Quando bater a dúvida em uma linguagem nova, volte às três perguntas do começo: **quando os tipos são checados, quem cuida da memória e como o código roda.** A maior parte das respostas sai daí.
