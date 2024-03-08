"use strict";

function addToTotal(totalType, line, isConvoy, isFHunt) {
  let numb = 0;
  // a confusing line... but i'm not good at regular expressions. splits the line twice,
  // once at the : (always precedes the number), and ends at the cm (always after the number)
  console.log("Total of type: " + totalType);
  console.log("Line: " + line);


  if (isConvoy) {
    if (line.includes("+")) {
      numb = line.split("+")[1].split("food ")[0].match(/\d/g);
      console.log("Added " + numb + " mats!");
    } else (line.includes("+")); {
      numb = line.split("+")[1].split("food ")[0].match(/\d/g);
      console.log("Added " + numb + " mats!");
    }
  }    

  try {
    numb = parseInt(numb.join(""));
    totalType += numb;
  } catch {
    console.error("Tried to add a non-number (null value, not NaN). Skipping this line: \n" + line);
  }
  return totalType;
}

// these vars store the total looted and robbed in this report

document.querySelector('#format').addEventListener('click', () => {
  let totalLooted = 0;
  let totalRobbed = 0;
  let totalConvoyReceived = 0; // materials
  let totalConvoySent = 0; // materials
  let totalFoodConvoySent = 0; // food
  let totalHunted = 0;
  let numb = 0;

  let isConvoy = false;
  let isFHunt = false;

  document.querySelector('#output').value = '[b]' + document.querySelector('#input').value.split(/\r\n|\r|\n/).map(line => {
    if (line.includes('Robbed')) {
      totalRobbed = addToTotal(totalRobbed, line);
      return '[color=#c5130f]' + line.replace(/^.*(?=Robbed)/, '') + '[/color]';
    }

    if (line.includes('Loot')) {
      totalLooted = addToTotal(totalLooted, line);
      return '[color=#09750c]' + line.replace(/^.*(?=Loot)/, '') + '[/color]';
    }

    if (line.includes("Convoy received")) {
      totalConvoyReceived = addToTotal(totalConvoyReceived, line);
      return line.replace(/^.*(?=Convoy received)/, '');
    }

    if (line.includes("Convoy sent")) {
      if (line.includes("food")) {
        totalFoodConvoySent = addToTotal(totalFoodConvoySent, line, true); // isConvoy is true
      } else {
        totalConvoySent = addToTotal(totalConvoySent, line, true); // isConvoy is true
      }
      return '[color=#002ead]Convoy' + line.replace(/^.*(?=Convoy sent)/, '').split("Convoy")[1] + '[/color]';
    }

    if (line.includes("Successful")) {
      totalHunted = addToTotal(totalHunted, line);
      return '[color=#09750c]Successful' + line.split("Successful")[1] + '[/color]';
    }

    // named this the "French Hunt (FHunt)"
    if (line.includes("Vos chasseuses")) {
      totalHunted = addToTotal(totalHunted, line, false, true);
      return '[color=#09750c]Vos chasseuses' + line.split("Vos chasseuses")[1] + '[/color]';
    }

    if (line.includes("Attack")) {
      return 'Attack' + line.split("Attack")[1];
    }

    if (line.includes("Canceled")) {
      return 'Canceled' + line.split("Canceled")[1];
    }

    if (line.includes("Reinforcements")) {
      return 'Reinforcements' + line.split("Reinforcements")[1];
    }

    if (line.startsWith('Antzzz')) {
      return line.replace(/^Antzzz\s?([a-zA-Z]+)\s?\d\d?h\d\d?/, '');
    }

    // had someone else come up with this line for me. does magic and gets rid of the
    // blank spaces left when a PM is found instead of convoy, HF flood, etc
  }).join('\n').replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, "") + '[/b]';

  // this part of the code is a bit redundant, but I wanted to leave the earlier code (original, not mine) intact.
  // basically, we create a variable, and append every line that we've created thus far that is NOT empty into it.
  // then after the for loop, we attach it to the #output (textarea) object.
  let outputContent = "";
  let lines = document.querySelector('#output').value.split('\n');

  for (let i = 0; i < lines.length; i++) { // loop through every line in the output object so far
    if (lines[i] == "") { // checks if the line is empty
      continue; // if empty, move along
    } else { // if NOT empty, append content to output
      outputContent += lines[i] + '\n';
    }
  }

  document.querySelector('#output').value = outputContent; // attach the result of the for loop to the output object

  // append all new stuff to end of document
  document.querySelector('#output').value += '\n\n' + '[b]' + '[color=#09750c]Total HF looted: ' + totalLooted.toLocaleString() + '[/color][/b]';
  document.querySelector('#output').value += '\n' + '[b]' + '[color=#09750c]Total HF hunted: ' + totalHunted.toLocaleString() + '[/color][/b]';
  document.querySelector('#output').value += '\n' + '[b]' + '[color=#c5130f]Total HF robbed: ' + totalRobbed.toLocaleString() + '[/color][/b]';

  document.querySelector('#output').value += '\n\n' + '[i]Approximate:[/i] ';
  document.querySelector('#output').value += '\n' + '[b]' + '[color=#002ead]Total materials [i]sent[/i]: ' + totalConvoySent.toLocaleString() + '[/color][/b]';
  document.querySelector('#output').value += '\n' + '[b]' + 'Total materials [i]received[/i]: ' + totalConvoyReceived.toLocaleString() + '[/b]';
  document.querySelector('#output').value += '\n' + '[b]' + 'Total food [i]sent[/i]: ' + totalFoodConvoySent.toLocaleString() + '[/b]';

});

// for the copy-to-clipboard button:
document.querySelector('#copy').addEventListener('click', () => {
  let copyText = document.querySelector("#output");
  copyText.select();
  copyText.setSelectionRange(0, 99999); // for mobile devices

  navigator.clipboard.writeText(copyText.value); // write text to clipboard
  document.querySelector('#copy').innerHTML = "Copied text to clipboard! / Texte copié!";
})

// for clearing the input
document.querySelector('#clear').addEventListener('click', () => {
  document.querySelector('#input').value = "";
  document.querySelector('#clear').innerHTML = "Text cleared! / Texte effacé!";
})
