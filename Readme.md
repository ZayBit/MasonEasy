# masoEasy
**Grid masonry con la opcion de filtrado elementos responsivo**

[DEMO](https://zaybit.github.io/MasonEasy/)

![g1](https://i.postimg.cc/sD5qGLY7/g1.gif)

> **configuracion por defecto**


| tipo | propiedad | por defecto | definicion |
|----|----|----|----|
| **string** | selector | **".item"** |clase de los elementos|
| **bool** | filter_mode | **false** |usar el filtrado de elementos|
| **number** | scrollWidth | **17** |ancho del scroll vertical|
| **string** | filterControls | **".filter-controls"** |contenedor de los botones para filtrar|
| **string** | currentCategoryClass | **"select-category"** |clase añadida a los elementos filtrados|
| **number** | transition | **300** |transición de los elementos al moverse|
> **HTML**

La estructura dentro del contenedor con la clase **"filter-controls"** no necesariamente tiene que ser una lista pero si contener el atributo **data-category**, a su vez los elementos del contenedor con el id **"masoEasy"** tienen que tener el mismo atributo **data-category**
~~~html
   <div class="filter-controls">
        <ul>
            <li>
                <a href="#" data-category="all" class="current-category">All</a>
            </li>
            <li>
                <a href="#" data-category="city">City</a>
            </li>
        </ul>
</div>
<div id="masoEasy">
    <div class="item"  data-category="city">
</div>
~~~
> **CSS**
~~~css
    /* No es necesario importar los estilos css */
~~~
> **JS**
~~~js
masonEasy('masonEasy')
~~~
