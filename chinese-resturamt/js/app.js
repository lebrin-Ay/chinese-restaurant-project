//  enables the toggling of the collapsible navbar when the toggle button is clicked
// and it also hides the navbar when the user clicks outside of it.
document.addEventListener("DOMContentLoaded", function () {
    const navbarToggle = document.querySelector("#navbarToggle");
    const collapsibleNav = document.querySelector("#navbarSupportedContent");
    const navHomeButton = document.querySelector("#navHome");
    const navMenuButton = document.querySelector("#navMenu");
    const navAwardButton = document.querySelector("#navAward");
    
    // when the toggle button is clicked, the function inside the event listener is executed.
    navbarToggle.addEventListener("click", function (event) {
      setTimeout(function () {
        const screenWidth = window.innerWidth;
        if (screenWidth < 768 && !collapsibleNav.contains(document.activeElement)) {
          collapsibleNav.classList.remove("show");
        }
      }, 100)
    })

    navHomeButton.addEventListener("click", function () {
      if (collapsibleNav.classList.contains("show")) {
        collapsibleNav.classList.remove("show");
      }
      navHomeButton.classList.add("active");
      navMenuButton.classList.remove("active");
      navAwardButton.classList.remove("active");
    });
  
    navMenuButton.addEventListener("click", function () {
      if (collapsibleNav.classList.contains("show")) {
        collapsibleNav.classList.remove("show");
      }
      navHomeButton.classList.remove("active");
      navMenuButton.classList.add("active");
      navAwardButton.classList.remove("active");
    });
  
    navAwardButton.addEventListener("click", function () {
      if (collapsibleNav.classList.contains("show")) {
        collapsibleNav.classList.remove("show");
      }
      navHomeButton.classList.remove("active");
      navMenuButton.classList.remove("active");
      navAwardButton.classList.add("active");
    });

    
  
    // used to handle clicks anywhere on the document, including outside the navbar toggle 
    // button and the collapsible navbar content.
    document.addEventListener("click", function (event) {
      let targetElement = event.target;
      if (
        !targetElement.closest("#navbarToggle") &&
        !targetElement.closest("#navbarSupportedContent")
      ) {
        collapsibleNav.classList.remove("show");
      }
    });
});

// remove the class 'active' from the home button and switch to the menu button by adding an event listener to the menu button 
document.addEventListener("DOMContentLoaded", function () {
  const navHomeButton = document.querySelector("#navHome");
  const navMenuButton = document.querySelector("#navMenu");

  navMenuButton.addEventListener("click", function () {
    navHomeButton.classList.remove("active");
    navMenuButton.classList.add("active");
  });
});



(function (global) {
    const dc = {};

    const homeHtml = "snippets/home-snippet.html";
    const allCategoriesUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
    const categoriesTitleHtml = "snippets/categories-title-snippet.html";
    const categoryHtml = "snippets/category-snippet.html";
    const menuItemsUrl =  "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
    // const menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/%7Bcategory_short_name%7D.json";
    const menuItemHtml = "snippets/menu-item.html";
    const menuItemsTitleHtml = "snippets/menu-items-title.html";
  
    const insertHtml = function (selector, html) {
      let targetElem =  document.querySelector(selector);
      targetElem.innerHTML = html;
    };
  
   //   show loading icon inside element identified by 'selector'
   let showLoading = function (selector) {
      let html = "<div class='text-center>";
      html += "<img src='images/eclipse.gif'></div>";
      insertHtml(selector, html);
    };
  
   // Return substitue of '{propName}' with propValue in given 'string'
   let insertProperty = (string, propName, propValue) => {
      let propToReplace = `{{${propName}}}`;
      string = string.replaceAll(propToReplace, propValue);
      return string;
    };
  
    // On page load(before images or CSS)
    document.addEventListener('DOMContentLoaded', (event) => {
      // On first load, show home view
      showLoading("#main-content");
      
      fetch(homeHtml)
        .then(response => response.text())
        .then(responseText => {
          document.querySelector("#main-content").innerHTML = responseText;
        })
        .catch(error => console.error(error));
    });
  
    // load the menu categories view 
    dc.loadMenuCategories = () => {
      showLoading("#main-content");
      
      fetch(allCategoriesUrl)
        .then(response => response.json())
        .then(data => buildAndShowCategoriesHTML(data))
        .catch(error => console.error(error));
    };

    // load the menu items view
    dc.loadMenuItems = (categoryShort) => {
      showLoading("#main-content");

      fetch(`${menuItemsUrl}${categoryShort}.json`)
      .then(response => response.json())
      .then(data => buildAndShowMenuItemsHTML(data))
      .catch(error => console.error(error));
    };
  
    // builds HTML for the categories page based on the data returned from the server
    const buildAndShowCategoriesHTML = (categories) => {
      // Load title snippet of categories page
      fetch(categoriesTitleHtml)
        .then(response => response.text())
        .then(categoriesTitleHtml => {
          // Retrieve single category snippet
          fetch(categoryHtml)
            .then(response => response.text())
            .then(categoryHtml => {
              const categoriesViewHtml = buildCategoriesViewHtml(
                categories,
                categoriesTitleHtml,
                categoryHtml
              );
              insertHtml("#main-content", categoriesViewHtml);
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    };
  
    // Using categories data and snippets html
    // build categories view HTML to be inserted into page
    const buildCategoriesViewHtml = (categories, categoriesTitleHtml, categoryHtml) => {
      let finalHtml = categoriesTitleHtml;
      finalHtml += "<section class='row'>";
    
      // Loop over categories
      finalHtml += categories.map(category => {
        let html = categoryHtml;
        const { name, short_name } = category;
        html = insertProperty(html, "name", name);
        html = insertProperty(html, "short_name", short_name);
        return html;
      }).join('');
    
      finalHtml += "</section>";
      return finalHtml;
    };

    // builds HTML for the single category page based on the data from the server(json file)
    const buildAndShowMenuItemsHTML = ( categoryMenuItems) => {
      console.log(categoryMenuItems);
      // Load title snippet of menu items page
      fetch(menuItemsTitleHtml)
      .then(response => response.text())
      .then(menuItemsTitleHtml => {
      // Retrieve single menu item snippet
      fetch(menuItemHtml)
      .then(response => response.text())
        .then(menuItemHtml => {
          const menuItemsViewHtml = buildMenuItemsViewHtml(
            categoryMenuItems,
             menuItemsTitleHtml,
              menuItemHtml
            );
           insertHtml("#main-content", menuItemsViewHtml);
          })
         .catch(error => console.error(error));
        })
      .catch(error => console.error(error));
    };

   // Using category and menu items data and snippets html
   // build menu items view HTML to be inserted into page
   const buildMenuItemsViewHtml = (categoryMenuItems, menuItemsTitleHtml, menuItemHtml) => {
     menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "name", categoryMenuItems.category.name);
     menuItemsTitleHtml = insertProperty(
       menuItemsTitleHtml,
       "special_instructions",
       categoryMenuItems.category.special_instructions
     );
  
     let finalHtml = menuItemsTitleHtml;
     finalHtml += "<section class='row'>";

     // loop over menu items 
     const menuItems = categoryMenuItems.menu_items;
     const catShortName = categoryMenuItems.category.short_name;
  
     menuItems.forEach((menuItem, index) => {
       // insert menu item values
       let html = menuItemHtml;
       html = insertProperty(html, "short_name", menuItem.short_name);
       html = insertProperty(html, "catShortName", catShortName);
       html = insertItemPrice(html, "price_small", menuItem.price_small);
       html = insertItemPortionName(html, "small_portion_name", menuItem.small_portion_name);
       html = insertItemPrice(html, "price_large", menuItem.price_large);
       html = insertItemPortionName(html, "large_portion_name", menuItem.large_portion_name);
       html = insertProperty(html, "name", menuItem.name);
       html = insertProperty(html, "description", menuItem.description);
  
       if (index % 2 !== 0) {
         html += "<div class='clearfix'></div>"
        }
  
       finalHtml += html;
      });
  
      finalHtml += "</section>";
      return finalHtml;
    };


    // append price with $ if price exists
    const insertItemPrice = (html, pricePropName, priceValue) => {
      // if not specified, replace with empty string
      if (!priceValue) {
        return insertProperty(html, pricePropName, "");
      }
    
      priceValue = `$${priceValue.toFixed(2)}`;
      html = insertProperty(html, pricePropName, priceValue);
      return html;
    };
    
    // append portion name if portion does not exist
    const insertItemPortionName = (html, portionPropName, portionValue) => {
      // if not specified, return original string
      if (!portionValue) {
        return insertProperty(html, portionPropName, "");
      }
    
      portionValue = `(${portionValue})`;
      html = insertProperty(html, portionPropName, portionValue);
      return html;
    };
    
     
    window.$dc = dc;
  }) (window);

  