## Veams Components Starter Kit

Veams Components Starter Kit is a simple partials library to speed up your workflow with Veams-Generator.

### Requirements

In general there are no requirements. Just download the package and import the files you need. 

If you want to install it with Bower, here are the requirements: 

- NodeJS
- Bower (npm install -g bower)

### Installation

``` bash
bower install veams-components --save
```

### How to use

Just copy the files you need into your project. 

### Main Files

#### `components`

Here you can find general components. just copy and paste the files you need into your project (`resources/templates/partials/components`). 

Each component has a data (JSON) and style (SCSS) file in the same folder. 

#### `wrap-with`

In the `wrap-with` folder you can find panel templates (also called factory or mini template). 
These templates can be used to wrap components and modules and structure your code base. 

Just copy and paste a `wrap-with` into `resources/templates/partials/wrap-with` and be sure you have added this folder to your assemble task. 

#### `markdown`

I created some markdown files to speed up the integration of dummy content. 

Just choose the files you need from the `markdown` folder.
